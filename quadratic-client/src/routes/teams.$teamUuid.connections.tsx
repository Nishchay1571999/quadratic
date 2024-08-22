import { DashboardHeader } from '@/dashboard/components/DashboardHeader';
import { useDashboardRouteLoaderData } from '@/routes/_dashboard';
import { connectionClient } from '@/shared/api/connectionClient';
import { Connections } from '@/shared/components/connections/Connections';
import { ROUTES } from '@/shared/constants/routes';
import { LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { teamUuid } = params;
  if (!teamUuid) throw new Error('No team UUID provided');

  const [staticIps] = await Promise.all([connectionClient.staticIps.list()]);
  return { teamUuid, staticIps };
};

export const Component = () => {
  const { teamUuid, staticIps } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const {
    activeTeam: {
      connections,
      userMakingRequest: { teamPermissions },
    },
  } = useDashboardRouteLoaderData();

  if (!teamPermissions?.includes('TEAM_EDIT')) {
    return <Navigate to={ROUTES.TEAM(teamUuid)} />;
  }

  return (
    <>
      <DashboardHeader title="Team connections" />
      <div className="max-w-4xl">
        <Connections connections={connections} teamUuid={teamUuid} staticIps={staticIps} />
      </div>
    </>
  );
};
