import { useAuth } from '../contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import { Role } from '../schemaTypes/graphql';
import SurveyComponent from './Survey';
import { simpleConfig } from '../form-config/simple-config';

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  console.log('\n\n', isAuthenticated, '\n\n');
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (isAuthenticated && user?.role === Role.Reviewer) {
    return <SurveyComponent config={simpleConfig} />
  }

  return <></>;
};

export default AdminRoute;

