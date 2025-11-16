import { useAuth } from '../contexts/AuthContext';
import { Role } from '../schemaTypes/graphql';
import { LoadingFallback } from './atoms/Loading';
import { useNavigate } from 'react-router-dom';

export type ProtectedRouteProps = {
  allowedRole: Role;
  children: React.ReactNode;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingFallback />
  }

  if (!isAuthenticated) {
    navigate('/login', { replace: true });

    return null
  }

  if (user?.role === props.allowedRole) {
    return props.children
  }

  return <></>
}
