import SubmissionCard, { SubmissionCardProps } from '../molecules/SubmissionCard';
import Text from '../atoms/Text';

interface SubmissionsListProps {
  submissions: SubmissionCardProps[];
  isLoading?: boolean;
}

const SubmissionsList = ({ submissions, isLoading = false }: SubmissionsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <Text variant="body" color="muted">
            Loading submissions...
          </Text>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <Text variant="h3" color="muted" className="mb-2">
          No submissions yet
        </Text>
        <Text variant="body" color="muted">
          Survey submissions will appear here once users start responding.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Text variant="body" color="muted">
          Total Submissions: {submissions.length}
        </Text>
      </div>
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          id={submission.id}
          userId={submission.userId}
          submittedAt={submission.submittedAt}
          data={submission.data}
        />
      ))}
    </div>
  );
};

export default SubmissionsList;

