import { Heart } from 'lucide-react'
import React, { useEffect } from 'react'
import useUserStore from "../store/user";



const LikeBtn = ({postId,liked,setLikes}) => {
    const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

      const handleClick = async () => {
    const res = await fetch(`http://localhost:3000/api/post/lul/${postId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      if (data.message==="liked") {
        setLikes((prev) => [...prev,user._id]);
      }
      if (data.message==="unliked") {
        setLikes((prev) => prev.filter((id) => id !== user._id));
      }
    }
  };



  return (
    <button title="like">
                <Heart color={liked ? "red" : "white"} fill={liked ? "red" : "none"} onClick={handleClick} />
              </button>
  )
}

export default LikeBtn
