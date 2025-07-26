import { Heart } from 'lucide-react'
import React, { useEffect } from 'react'
import useUserStore from "../store/user";
import { useLocation } from 'react-router-dom';
import usePostStore from '../store/posts';


const LikeBtn = ({postId,liked,setLikes}) => {
    const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateExplorePostLikes = usePostStore((state) => state.updateExplorePostLikes);
  const updateFeedPostLikes = usePostStore((state) => state.updateFeedPostLikes);


    const location = useLocation();
  const fromExplore = location.state?.fromExplore;
  const fromFeed = location.state?.fromFeed;
  

      const handleClick = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/lul/${postId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      if (data.message==="liked") {
        // setLikes((prev) => [...prev,user._id]);
         setLikes((prev) => {
          const updated = [...prev, user._id];
          // if (fromExplore) {
            updateExplorePostLikes(postId, updated);
          // }
          // if (fromFeed) {
            updateFeedPostLikes(postId,updated)
          // }
          return updated;
        });
      }
      if (data.message==="unliked") {
        // setLikes((prev) => prev.filter((id) => id !== user._id));
         setLikes((prev) => {
          const updated = prev.filter((id) => id !== user._id);
          // if (fromExplore) {
            updateExplorePostLikes(postId, updated);
          // }
          // if (fromFeed) {
            updateFeedPostLikes(postId,updated)
          // }
          return updated;
        });
      }
    }
  };



  return (
    <button title={liked ? "Unlike" : "Like"} >
                <Heart color={liked ? "red" : "white"} fill={liked ? "red" : "none"} onClick={handleClick} />
              </button>
  )
}

export default LikeBtn
