import SurveyComponent from '../Survey';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const SurveyPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Text variant="h1" className="text-gray-800">
                Survey Form
              </Text>
              <Text variant="body" className="text-gray-600 mt-1">
                Please complete the survey below
              </Text>
            </div>
            <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Survey Content */}
      <div className="max-w-4xl mx-auto p-8">
        <SurveyComponent />
      </div>
    </div>
  );
};

export default SurveyPage;

