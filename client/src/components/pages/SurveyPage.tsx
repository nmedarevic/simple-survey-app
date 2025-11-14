import SurveyComponent from '../Survey';
import { simpleConfig } from '../../form-config/simple-config';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../atoms/Button';

const SurveyPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Survey</h1>
          <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
            Logout
          </Button>
        </div>
        <SurveyComponent config={simpleConfig} />
      </div>
    </div>
  );
};

export default SurveyPage;

