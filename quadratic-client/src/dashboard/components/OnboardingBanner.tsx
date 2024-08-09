import { LanguageIcon } from '@/app/ui/components/LanguageIcon';
import Logo from '@/dashboard/components/quadratic-logo.svg';
import { useDashboardRouteLoaderData } from '@/routes/_dashboard';
import { apiClient } from '@/shared/api/apiClient';
import { ROUTES } from '@/shared/constants/routes';
import { CONTACT_URL, DOCUMENTATION_URL } from '@/shared/constants/urls';
import { Button } from '@/shared/shadcn/ui/button';
import { cn } from '@/shared/shadcn/utils';
import { CheckCircledIcon, CircleIcon, Cross1Icon } from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function OnboardingBanner() {
  const {
    activeTeam: {
      team: { uuid: teamUuid },
      clientDataKv,
      connections,
      files,
      users,
      invites,
    },
  } = useDashboardRouteLoaderData();
  const tabContentClassName = 'flex flex-col gap-2';
  const contentBtnClassName = 'min-w-44';

  const tabs = [
    {
      label: 'Create a sheet',
      completed: files.length > 0,
      content: (
        <>
          <p>
            Start with a blank file, one of our example files, or by importing your own data from a file, an API, or an
            external data source.
          </p>
          <p>
            <Button asChild variant="outline" className={contentBtnClassName}>
              <Link to={ROUTES.CREATE_FILE(teamUuid)}>New file</Link>
            </Button>
          </p>
        </>
      ),
    },
    {
      label: 'Create a connection',
      completed: connections.length > 0,
      content: (
        <>
          <p>Connect to an external data source and pull your data into Quadratic.</p>
          <div className="flex gap-2">
            <Button variant="outline" className={contentBtnClassName + ' gap-2'} asChild>
              <Link to={ROUTES.TEAM_CONNECTION_CREATE(teamUuid, 'MYSQL')}>
                <LanguageIcon language="MYSQL" /> MySQL
              </Link>
            </Button>
            <Button variant="outline" className={contentBtnClassName + ' gap-2'} asChild>
              <Link to={ROUTES.TEAM_CONNECTION_CREATE(teamUuid, 'POSTGRES')}>
                <LanguageIcon language="POSTGRES" /> Postgres
              </Link>
            </Button>
          </div>
        </>
      ),
    },
    {
      label: 'Invite teammates',
      completed: users.length > 1 || invites.length > 0,
      content: (
        <>
          <p>Quadratic is best with other people. Invite others and collaborate in real-time on your data analyses.</p>
          <div>
            <Button asChild variant="outline" className={contentBtnClassName}>
              <Link to={ROUTES.TEAM_MEMBERS(teamUuid)}>Invite people</Link>
            </Button>
          </div>
        </>
      ),
    },
  ];
  // Set the tab based on which item is incomplete
  const firstCompletedIndex = tabs.findIndex(({ completed }) => !completed);
  const [activeTabIndex, setActiveTabIndex] = useState(String(firstCompletedIndex === -1 ? 0 : firstCompletedIndex));
  const noCompletions = tabs.length;
  const noCompletionsCompleted = tabs.filter(({ completed }) => completed).length;

  const handleDismiss = () => {
    apiClient.teams.update(teamUuid, { clientDataKv: { onboardingBannerDismissed: true } });
  };

  if (clientDataKv.onboardingBannerDismissed) {
    return null;
  }

  // TODO: don't show this banner if the user is a TEAM_VIEWER

  return (
    <div className="relative mt-3 flex flex-col rounded-md border border-input px-4 py-3 shadow-sm">
      <Button
        variant="link"
        size="icon"
        className="absolute right-0.5 top-0.5 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
        onClick={handleDismiss}
      >
        <Cross1Icon />
      </Button>
      <div className="flex items-center gap-4 border-b border-border pb-3">
        <img src={Logo} width="24" height="35" alt="Quadratic logo" />
        <div className="flex flex-col">
          <h3 className="text-md font-medium leading-6 tracking-tight">Getting started with your team</h3>
          <p className="text-sm text-muted-foreground">
            <strong className="font-semibold">
              {noCompletionsCompleted} of {noCompletions} complete
            </strong>{' '}
            ·{' '}
            {noCompletionsCompleted === noCompletions ? (
              <>
                All tasks complete!{' '}
                <Button
                  onClick={handleDismiss}
                  variant="link"
                  className="h-auto p-0 text-inherit underline hover:text-primary"
                >
                  Dismiss
                </Button>
                .
              </>
            ) : (
              <>
                Need help?{' '}
                <a href={DOCUMENTATION_URL} target="_blank" rel="noreferrer" className="underline hover:text-primary">
                  Read the docs
                </a>{' '}
                or{' '}
                <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="underline hover:text-primary">
                  contact us
                </a>
                , we love hearing from folks.
              </>
            )}
          </p>
        </div>
      </div>
      <Tabs.Root
        value={activeTabIndex}
        onValueChange={(newActiveTab) => setActiveTabIndex(newActiveTab)}
        className="grid grid-cols-[14rem_1fr] text-sm"
      >
        <Tabs.List className="flex flex-col gap-[1px] border-r border-border pr-4 pt-2">
          {tabs.map(({ label, completed }, index) => (
            <Tabs.Trigger
              key={index}
              value={String(index)}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded px-2 ring-offset-background transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent',
                completed && 'text-success'
              )}
            >
              {completed ? (
                <CheckCircledIcon className="text-success" />
              ) : (
                <CircleIcon className="text-muted-foreground opacity-30" />
              )}
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="py-3 pl-4">
          {tabs.map(({ content }, index) => (
            <Tabs.Content key={index} value={String(index)} className={tabContentClassName}>
              {content}
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </div>
  );
}
