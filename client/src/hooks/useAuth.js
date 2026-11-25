import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, token, status, error } = useSelector((state) => state.auth);
  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    status,
    error,
  };
};

export default useAuth;
