import { useState } from "react";
import { formatTime } from "@/lib/dayjs";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
 export const CommentItem = ({ comment, user, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 180; 

  const isLong = comment.content.length > maxLength;
  const displayedText = expanded
    ? comment.content
    : comment.content.slice(0, maxLength);

  return (
    <div className="mb-3 p-2 flex items-start last:mb-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <div className="flex gap-4 w-full">
        <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
          <img
            src={comment.commentedBy.avatar || "/default-avatar.png"}
            alt={comment.commentedBy.username}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to={`/${comment.commentedBy.username}`}>
                <p className="text-md font-medium text-black dark:text-white">
                  {comment.commentedBy.username}
                </p>
              </Link>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formatTime(comment.createdAt)}
              </span>
            </div>
            {user._id === comment.commentedBy._id && (
              <Trash onClick={() => onDelete(comment._id)} className="text-black dark:text-white hover:text-red-600 dark:hover:text-red-400 active:fill-current transition cursor-pointer" size={17} />
            )}
          </div>

          <pre className="text-sm max-w-[90%] font-sans break-all whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {displayedText}
          </pre>

          {isLong && (
            <button
              className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
