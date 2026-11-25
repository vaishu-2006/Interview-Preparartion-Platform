import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Keeps already-logged-in users out of Login/Register pages.
const PublicRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.hasSelectedPath ? '/dashboard' : '/select-path'} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
