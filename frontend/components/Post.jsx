import React from "react";
import { Dot } from "lucide-react";
import CommentDrawer from "./CommentDrawer";
import PostCommentBtn from "./PostCommentBtn";
import LikeBtn from "./LikeBtn";
import useUserStore from "../store/user";
import { Link } from "react-router-dom";
import SaveBtn from "./SaveBtn";
import PostOptionsBtn from "./PostOptionsBtn";
const CAPTION_MAX_LENGTH = 60;
import { formatTime } from "@/lib/dayjs";

const Post = ({ post }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [commentCount, setCommentCount] = React.useState(0);
  const [likes, setLikes] = React.useState(post.likes);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const fetchCommentCount = async () => {
    const res = await fetch(
      `/api/post/comments/${
        post._id
      }?countOnly=true`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    if (data.success) setCommentCount(data.data);
  };

  React.useEffect(() => {
    fetchCommentCount();
  }, [post._id]);

  return (
    <div className="w-full flex flex-col gap-3 py-8 border-b border-slate-300 dark:border-slate-700 bg-white dark:bg-black text-black dark:text-white">
      {/* header */}
      <div className="flex justify-between px-2 items-center">
        <Link to={`/${post.postedBy.username}`}>
          <div className="flex gap-4 items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img
                src={post.postedBy.avatar || "/default-avatar.png"}
                alt={post.postedBy.username}
                className="h-full w-full object-center"
              />
            </div>
            <p className="text-black dark:text-white">{post.postedBy.username}</p>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatTime(post.createdAt)}
            </span>
          </div>
        </Link>
        <PostOptionsBtn postedBy={post.postedBy} postId={post._id} />
      </div>

      {/* image */}
      <div className="overflow-hidden">
        {post.media && post.mediaType === "video" ? (
          post.postType === "reel" ? (
            <video
              src={post.media}
              autoPlay
              loading="lazy"
              loop
              // muted
              // controls

              className="w-full max-h-dvh object-contain"
              style={{ aspectRatio: "auto" }}
            />
          ) : (
            <video
              src={post.media}
              autoPlay
              loop
              loading="lazy"
              // muted
              // controls
              className="w-full object-cover"
              style={{ aspectRatio: "auto", maxHeight: "550px" }}
            />
          )
        ) : (
          <img
            src={post.media}
            alt={post.postedBy.username}
            className="w-full object-contain"
            style={{ aspectRatio: "auto", maxHeight: "550px" }}
            loading="lazy"
          />
        )}
      </div>

      {/* L and c  */}
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-9">
          <LikeBtn
            liked={likes.includes(user._id)}
            setLikes={setLikes}
            postId={post._id}
          />
          <CommentDrawer setCommentCount={setCommentCount} postId={post._id} />
        </div>
        <SaveBtn postId={post._id} />
      </div>

      {/* L and C count  */}
      <div>
        <div className="flex gap-2 px-2 text-black dark:text-white">
          <p>{likes.length} Likes</p>
          <Dot />
          <p>{commentCount ? commentCount : 0} Comments</p>
        </div>
      </div>

      {/* cap  */}
      {/* <div className="px-2">
        <p>{post.caption}</p>
      </div> */}

      <div className="px-2 break-words text-sm text-black dark:text-white">
        {post.caption.length > CAPTION_MAX_LENGTH && !isExpanded ? (
          <>
            {post.caption.slice(0, CAPTION_MAX_LENGTH)}...
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 dark:text-blue-400 ml-1 hover:underline"
            >
              more
            </button>
          </>
        ) : (
          <>
            {post.caption}
            {post.caption.length > CAPTION_MAX_LENGTH && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-blue-600 dark:text-blue-400 ml-1 hover:underline"
              >
                less
              </button>
            )}
          </>
        )}
      </div>

      {/* add comment  */}
      <PostCommentBtn setCommentCount={setCommentCount} postId={post._id} />
    </div>
  );
};

export default Post;
