import Card from '../atoms/Card';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';

export interface SubmissionCardProps {
  id: string;
  userId: string;
  submittedAt: string;
  data: any;
  onExpand?: () => void;
}

const SubmissionCard = ({ id, userId, submittedAt, data, onExpand }: SubmissionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Text variant="h3" className="mb-2">
            Submission #{id}
          </Text>
          <Text variant="small" color="muted">
            Submitted: {formatDate(submittedAt)}
          </Text>
        </div>
        <Badge variant="info">User ID: {userId}</Badge>
      </div>
      
      <div className="border-t pt-4">
        <Text variant="label" className="mb-3">
          Response Data:
        </Text>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-3 rounded">
              <Text variant="small" color="muted" className="mb-1">
                {key}:
              </Text>
              <Text variant="body" className="break-words whitespace-pre-wrap">
                {renderValue(value)}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SubmissionCard;

