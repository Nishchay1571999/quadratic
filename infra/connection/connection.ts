import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { latestAmazonLinuxAmi } from "../helpers/latestAmazonAmi";
import { runDockerImageBashScript } from "../helpers/runDockerImageBashScript";
import { instanceProfileIAMContainerRegistry } from "../shared/instanceProfileIAMContainerRegistry";
import {
  connectionEc2SecurityGroup,
  connectionNlbSecurityGroup,
} from "../shared/securityGroups";
const config = new pulumi.Config();

// Configuration from command line
const connectionSubdomain = config.require("connection-subdomain");
const dockerImageTag = config.require("docker-image-tag");
const quadraticApiUri = config.require("quadratic-api-uri");
const connectionECRName = config.require("connection-ecr-repo-name");
const ecrRegistryUrl = config.require("ecr-registry-url");

// Configuration from Pulumi ESC
const domain = config.require("domain");
const certificateArn = config.require("certificate-arn");
const subNet1 = config.require("subnet1");
const subNet2 = config.require("subnet2");
const vpcId = config.require("vpc-id");

// Allocate Elastic IP for the instance so it remands the same after deployments
const eip = new aws.ec2.Eip("nat-eip-1", {
  vpc: true,
});

// create the instance
const instance = new aws.ec2.Instance("connection-instance", {
  tags: {
    Name: `connection-instance-${connectionSubdomain}`,
  },
  instanceType: "t2.micro",
  iamInstanceProfile: instanceProfileIAMContainerRegistry,
  vpcSecurityGroupIds: [connectionEc2SecurityGroup.id],
  subnetId: subNet1, // Assign a subnet, otherwise a random one will be chosen which could be disconnected from the NLB
  ami: latestAmazonLinuxAmi.id,
  // Run Setup script on instance boot to create connection systemd service
  userDataReplaceOnChange: true,
  userData: eip.publicIp.apply((publicIp) =>
    runDockerImageBashScript(
      connectionECRName,
      dockerImageTag,
      "quadratic-connection-development",
      {
        QUADRATIC_API_URI: quadraticApiUri,
        STATIC_IPS: `${publicIp}`,
      },
      true
    )
  ),
  associatePublicIpAddress: true,
});

// Allocate an Elastic IP for the instance
const eipAssociation = new aws.ec2.EipAssociation(
  "connection-instance-eip-association",
  {
    instanceId: instance.id,
    allocationId: eip.id,
  }
);

// Create a new Network Load Balancer
const nlb = new aws.lb.LoadBalancer("connection-nlb", {
  internal: false,
  loadBalancerType: "network",
  subnets: [subNet1, subNet2],
  enableCrossZoneLoadBalancing: true,
  securityGroups: [connectionNlbSecurityGroup.id],
});

// Create a new Target Group
const targetGroup = new aws.lb.TargetGroup("connection-nlb-tg", {
  port: 80,
  protocol: "TCP",
  targetType: "instance",
  vpcId: vpcId,
});

// Attach the instance to the new Target Group
const targetGroupAttachment = new aws.lb.TargetGroupAttachment(
  "connection-attach-instance-tg",
  {
    targetId: instance.id,
    targetGroupArn: targetGroup.arn,
  }
);

// Create NLB Listener for TLS on port 443
const nlbListener = new aws.lb.Listener("connection-nlb-listener", {
  tags: {
    Name: `connection-nlb-${connectionSubdomain}`,
  },
  loadBalancerArn: nlb.arn,
  port: 443,
  protocol: "TLS",
  certificateArn: certificateArn, // Attach the SSL certificate
  sslPolicy: "ELBSecurityPolicy-2016-08", // Choose an appropriate SSL policy
  defaultActions: [
    {
      type: "forward",
      targetGroupArn: targetGroup.arn,
    },
  ],
});

// Get the hosted zone ID for domain
const hostedZone = pulumi.output(
  aws.route53.getZone(
    {
      name: domain,
    },
    { async: true }
  )
);

// Create a Route 53 record pointing to the NLB
const dnsRecord = new aws.route53.Record("connection-r53-record", {
  zoneId: hostedZone.id,
  name: `${connectionSubdomain}.${domain}`, // subdomain you want to use
  type: "A",
  aliases: [
    {
      name: nlb.dnsName,
      zoneId: nlb.zoneId,
      evaluateTargetHealth: true,
    },
  ],
});

export const connectionPublicDns = dnsRecord.name;
