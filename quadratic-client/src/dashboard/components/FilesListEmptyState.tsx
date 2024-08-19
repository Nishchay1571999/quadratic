import { useDashboardState } from '@/dashboard/components/DashboardProvider';
import { Empty } from '@/dashboard/components/Empty';
import { FileIcon } from '@radix-ui/react-icons';
import mixpanel from 'mixpanel-browser';

export const FilesListEmptyState = ({ isPrivate }: { isPrivate?: boolean }) => {
  const [, setDashboardState] = useDashboardState();

  return (
    <div className="flex min-h-80 items-center justify-center border-4 border-dashed border-border">
      <Empty
        className="max-w-xl"
        title="No files"
        description={
          <>
            You don’t have any files yet.{' '}
            <button
              className="underline hover:text-primary"
              onClick={() => {
                mixpanel.track('[FilesEmptyState].clickCreateBlankFile');
                setDashboardState((prev) => ({ ...prev, showNewFileDialog: isPrivate ? 'private' : 'public' }));
              }}
            >
              Create a new file
            </button>{' '}
            or drag and drop files here.
          </>
        }
        Icon={FileIcon}
      />
    </div>
  );
};
