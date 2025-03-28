import React, { useState } from "react";
import { Heart, MessageCircleMore, Save, Dot  } from "lucide-react";
const Post = () => {
  const user = {
    avatar:
      "data:image/jpeg;base64,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",
    username: "John Doe",
    likes: 200,
    comments: 20,
    caption: "yo yo its your boy cheetah",
    media:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdfThvF_AiBSkjP-qj3K1lJpn-Z9WmPq8Vaw&s",
  };

  const [comment,setComment]=useState("")

  return (
    <div className=" w-full  flex flex-col gap-3 py-8 border-b-1 border-slate-400">

      {/* header */}

      <div className="flex justify-between px-2 items-center">
        <div className="flex gap-4 items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
            <img
              src={user.avatar}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          </div>
          <p>{user.username}</p>
        </div>
        <div className="cursor-pointer">. . .</div>
      </div>

      {/* image */}

      <div className="overflow-hidden">
        <img
          src={user.media}
          alt={user.username}
          className="w-full object-cover"
          style={{ aspectRatio: "auto", maxHeight: "600px" }}
        />
      </div>

      {/* L and c  */}

      <div className="flex justify-between items-center px-2">
        <div className="flex gap-9">
          <div title="like">
          <Heart />
          </div>
          <div title="comments">
            <MessageCircleMore />
          </div>
        </div>
        <Save />
      </div>

      {/* L and C count  */}

      <div>
        <div className="flex gap-2 px-2">
          <p>{user.likes} Likes</p>
          <Dot />
          <p>{user.comments} Comments</p>
        </div>
      </div>

      {/* cap  */}
      <div className="px-2">
        <p>{user.caption}</p>
      </div>

      {/* add comment  */}

      <div className="md:flex items-center p-2 hidden ">
        <input
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
          placeholder="Add a comment"
          type="text"
          className="outline-none flex-1 dark:border-gray-600 border-black border-b-1"
        />
      {
        comment.trim() && <button 
        className="px-4">Post</button>
        
      } 
      </div>


    </div>
  );
};

export default Post;
