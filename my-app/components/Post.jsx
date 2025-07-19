import React from "react";
import { Dot } from "lucide-react";
import CommentDrawer from "./CommentDrawer";
import PostCommentBtn from "./PostCommentBtn";
import LikeBtn from "./LikeBtn";
import useUserStore from "../store/user";
import { Link } from "react-router-dom";
import SaveBtn from "./SaveBtn";
import PostOptionsBtn from "./PostOptionsBtn";

const Post = ({ post }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [commentCount, setCommentCount] = React.useState(0);
  const [likes, setLikes] = React.useState(post.likes);
  const fetchCommentCount = async () => {
    const res = await fetch(
      `http://localhost:3000/api/post/comments/${post._id}?countOnly=true`,
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
    // console.log(post)
    fetchCommentCount();
  }, [post._id]);

  return (
    <div className="w-full flex flex-col gap-3 py-8 border-b-1 border-slate-400">
      {/* header */}
      <div className="flex justify-between px-2 items-center">
        <Link to={`/${post.postedBy.username}`}>
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
        </Link>
        <PostOptionsBtn postedBy={post.postedBy} postId={post._id} />
      </div>

      {/* image */}
      <div className="overflow-hidden">
        {post.media && post.mediaType === "video" ?(
          <video
            src={post.media}
            autoPlay
            loop
            // muted
            // controls
            className="w-full object-cover"
            style={{ aspectRatio: "auto", maxHeight: "550px" }}
          />
        )
        :
        (
           <img
            src={post.media}
            alt={post.postedBy.username}
            className="w-full object-cover"
            style={{ aspectRatio: "auto", maxHeight: "550px" }}
          />
        )
        
        
        }
      
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
        <div className="flex gap-2 px-2">
          <p>{likes.length} Likes</p>
          <Dot />
          <p>{commentCount ? commentCount : 0} Comments</p>
        </div>
      </div>

      {/* cap  */}
      <div className="px-2">
        <p>{post.caption}</p>
      </div>

      {/* add comment  */}
      <PostCommentBtn setCommentCount={setCommentCount} postId={post._id} />
    </div>
  );
};

export default Post;
