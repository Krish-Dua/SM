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
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/comments/${reel._id}?countOnly=true`,
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
            <div className="aspect-[9/16] relative rounded-lg border-1 overflow-hidden border-gray-500 h-full max-h-screen flex justify-center items-center">
          <video
            src={reel.media}
            className="h-full w-full rounded-lg"
            loop
            autoPlay
            playsInline
          />
            <div className="absolute right-4 bottom-24 flex flex-col gap-4 items-center">
            {/* <button className="text-white text-2xl">❤️</button> */}
            <div className='flex flex-col items-center ' >
            <LikeBtn postId={reel._id} liked={likes.includes(user._id)}
            setLikes={setLikes} />
          <p>{likes.length}</p>

            </div>
            {/* <button className="text-white text-2xl">💬</button> */}
            <div className='flex flex-col items-center ' >
          <CommentDrawer setCommentCount={setCommentCount} postId={reel._id} />
          <p>{commentCount ? commentCount : 0}</p>

</div>
            {/* <button className="text-white text-2xl">➤</button> */}
            <SaveBtn postId={reel._id} />

            <PostOptionsBtn postedBy={reel.postedBy} postId={reel._id} />
          </div>

          <div className="absolute left-4 bottom-4 right-16 flex flex-col gap-2">
            <Link to={`/${reel.postedBy.username}`} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                <img
                  src={reel.postedBy.avatar || '/default-avatar.png'}
                  alt={reel.postedBy.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex gap-10 items-center ">
                  <p className="text-md font-medium dark:text-white text-black">
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
                    className="text-gray-400 ml-1"
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
                      className="text-gray-400 ml-1"
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
