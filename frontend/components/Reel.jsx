import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LikeBtn from './LikeBtn';
import CommentDrawer from './CommentDrawer';
import SaveBtn from './SaveBtn';
import useUserStore from '../store/user';
import PostOptionsBtn from './PostOptionsBtn';
const Reel = ({ reel }) => {
  const user = useUserStore((state) => state.user);
  const [isExpanded, setIsExpanded] = useState(false);
  const caption = reel.caption;
  const CAPTION_MAX_LENGTH = 40;
    const [commentCount, setCommentCount] = React.useState(0);
  const [likes, setLikes] = React.useState(reel.likes);

const fetchCommentCount = async () => {
    const res = await fetch(
      `/api/post/comments/${reel._id}?countOnly=true`,
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
  }, [reel._id]);



  return (
    <div
          key={reel._id}
          className="h-[90dvh] mb-6 w-full snap-start flex justify-center items-center relative"
        >
            <div className="aspect-[9/16] relative rounded-lg border border-gray-400 dark:border-gray-700 overflow-hidden h-full max-h-screen flex justify-center items-center bg-black">
          <video
            src={reel.media}
            className="h-full w-full rounded-lg"
            loop
            autoPlay
            playsInline
          />
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
            {/* Like button */}
            <div className='flex flex-col items-center gap-2' >
              <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full p-3 hover:bg-white/60 dark:hover:bg-black/60 transition">
                <LikeBtn postId={reel._id} liked={likes.includes(user._id)}
                setLikes={setLikes} />
              </div>
              <p className="text-white dark:text-white text-xs font-medium drop-shadow-lg">{likes.length}</p>
            </div>

            {/* Comment button */}
            <div className='flex flex-col items-center gap-2' >
              <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full p-3 hover:bg-white/60 dark:hover:bg-black/60 transition">
                <CommentDrawer setCommentCount={setCommentCount} postId={reel._id} />
              </div>
              <p className="text-white dark:text-white text-xs font-medium drop-shadow-lg">{commentCount ? commentCount : 0}</p>
            </div>

            {/* Save button */}
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full p-3 hover:bg-white/60 dark:hover:bg-black/60 transition">
              <SaveBtn postId={reel._id} />
            </div>

            {/* Options button */}
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-full p-3 hover:bg-white/60 dark:hover:bg-black/60 transition">
              <PostOptionsBtn postedBy={reel.postedBy} postId={reel._id} />
            </div>
          </div>

          <div className="absolute left-4 bottom-4 right-16 flex flex-col gap-2">
            <Link to={`/${reel.postedBy.username}`} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={reel.postedBy.avatar || '/default-avatar.png'}
                  alt={reel.postedBy.username}
                  className="h-full w-full object-center"
                />
              </div>
              <div>
                <div className="flex gap-10 items-center ">
                  <p className="text-md font-medium text-white">
                    {reel.postedBy.username}
                  </p>
                </div>
              </div>
            </Link>

            {/* Caption */}
            <div className="text-white break-words text-sm">
              {caption.length > CAPTION_MAX_LENGTH && !isExpanded ? (
                <>
                  {caption.slice(0, CAPTION_MAX_LENGTH)}...
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-gray-300 ml-1 hover:text-white transition"
                  >
                    more
                  </button>
                </>
              ) : (
                <>
                  {caption}
                  {caption.length > CAPTION_MAX_LENGTH && (
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-gray-300 ml-1 hover:text-white transition"
                    >
                      less
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Reel;
