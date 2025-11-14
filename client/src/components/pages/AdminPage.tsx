import { useQuery } from '@apollo/client/react';
import { AllSubmissionsDocument } from '../../schemaTypes/graphql';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import SubmissionsList from '../organisms/SubmissionsList';

const AdminPage = () => {
  const { logout } = useAuth();
  const { data, loading, error } = useQuery(AllSubmissionsDocument);

  const submissions = data?.allSubmissions?.map((submission) => ({
    id: submission.id,
    userId: submission.userId,
    submittedAt: submission.submittedAt,
    data: typeof submission.data === 'string' ? JSON.parse(submission.data) : submission.data,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Text variant="h1" className="mb-2">
              Admin Dashboard
            </Text>
            <Text variant="body" color="muted">
              Review all survey submissions
            </Text>
          </div>
          <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
            Logout
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text variant="body" color="error">
              Error loading submissions: {error.message}
            </Text>
          </div>
        )}

        <SubmissionsList submissions={submissions} isLoading={loading} />
      </div>
    </div>
  );
};

export default AdminPage;

