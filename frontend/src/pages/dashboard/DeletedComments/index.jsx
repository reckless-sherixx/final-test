import { useSelector } from 'react-redux';
import { useGetDeletedCommentsQuery } from '@/redux/features/comments/commentApi';
import { formatDate } from '@/utility/formatDate';
import Avatar from '@/components/Avatar/Avatar';

const DeletedComments = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: deletedComments, isLoading, error } = useGetDeletedCommentsQuery();

  if (isLoading) {
    return <div className="p-8">Loading deleted comments...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading deleted comments</div>;
  }

  if (!deletedComments?.length) {
    return <div className="p-8">No deleted comments found</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Deleted Comments</h2>
      <div className="space-y-4">
        {deletedComments.map((comment) => (
          <div key={comment._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <Avatar username={comment.user?.username || ""} />
              <div>
                <p className="font-medium">{comment.user?.username}</p>
                <p className="text-sm text-gray-500">
                  Deleted on: {formatDate(comment.deletedAt)}
                </p>
              </div>
            </div>
            <p className="text-gray-700">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeletedComments;