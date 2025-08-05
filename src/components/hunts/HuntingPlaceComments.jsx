import { useState } from "react";
import { AddComment } from "../../services/HuntingPlaceServices.jsx";

export const HuntingPlaceComments = ({ huntingPlace, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const comment = await AddComment(huntingPlace.id, {
        comment: newComment.trim(),
      });

      setNewComment("");
      if (onCommentAdded) {
        onCommentAdded(comment);
      }
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Comments ({huntingPlace.comment_count || 0})
      </h3>

      {/* Add Comment Form */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Add a Comment
        </h4>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this hunting place..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {huntingPlace.comments && huntingPlace.comments.length > 0 ? (
          huntingPlace.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {comment.user_username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user_username || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No comments yet.</div>
            <div className="text-gray-400 text-sm mt-1">
              Be the first to share your experience!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
