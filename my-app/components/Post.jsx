import React, { useEffect, useState } from "react";
import { Heart, MessageCircleMore, Save, Dot } from "lucide-react";
import CommentDrawer from "./CommentDrawer";

const Post = ({ post }) => {

useEffect(()=>{
  console.log(post)
})

  const [comment, setComment] = useState("");

  return (
    <div className="w-full flex flex-col gap-3 py-8 border-b-1 border-slate-400">
      {/* header */}
      <div className="flex justify-between px-2 items-center">
        <div className="flex gap-4 items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
            <img
              src={post.postedBy.avatar || "/default-avatar.png"}
              alt={post.postedBy.username}
              className="h-full w-full object-cover"
            />
          </div>
          <p>{post.postedBy.username}</p>
        </div>
        <div className="cursor-pointer">. . .</div>
      </div>

      {/* image */}
      <div className="overflow-hidden">
        <img
          src={post.media}
          alt={post.postedBy.username}
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
          <CommentDrawer />
        </div>
        <Save />
      </div>

      {/* L and C count  */}
      <div>
        <div className="flex gap-2 px-2">
          <p>{post.likes.length} Likes</p>
          <Dot />
          <p>{post.comments ? post.comments.length : 0} Comments</p>
        </div>
      </div>

      {/* cap  */}
      <div className="px-2">
        <p>{post.caption}</p>
      </div>

      {/* add comment  */}
      <div className="md:flex items-center p-2 hidden ">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          type="text"
          className="outline-none flex-1 dark:border-gray-600 border-black border-b-1"
        />
        {comment.trim() && <button className="px-4">Post</button>}
      </div>
    </div>
  );
};

export default Post;
