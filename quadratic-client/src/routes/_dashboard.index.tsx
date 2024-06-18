import { useDashboardContext } from '@/routes/_dashboard';
import { ROUTES } from '@/shared/constants/routes';
import { Navigate } from 'react-router-dom';

export const Component = () => {
  const {
    activeTeam: {
      team: { uuid },
    },
  } = useDashboardContext();
  return <Navigate to={ROUTES.TEAM(uuid)} replace />;
};
