import React from 'react'
import LoaderSpinner from './LoaderSpinner';
import { toast } from 'react-toastify';


const PostCommentBtn = ({postId,className,setComments,setCommentCount}) => {
const [comment, setComment] = React.useState("");
const [loading,setLoading]= React.useState(false);


const handlePostcomment = async()=>{
if (loading) return;
 setLoading(true);
      const response = await fetch(`/api/post/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({toPost: postId, content:comment }),
      });
      const data = await response.json();
      if(!data.success) {
        toast.error(data.message)
      }
      else{
        toast.success("comment posted",{
          autoClose:1000,
          hideProgressBar:true
        })
      if (setComments) {
        setComments((prev) => [data.data, ...prev]);
      }
      if(setCommentCount) {
        setCommentCount((prev) => prev + 1);
      }
      }
      setLoading(false);
      setComment("");
    }
 

  return (

     <div className={`flex items-center p-2 ${className}`}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          type="text"
          className="outline-none flex-1 text-black dark:text-white border-b border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        {comment.trim() && <button onClick={handlePostcomment} className="px-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">{
          loading ? <LoaderSpinner size={24} /> : "Post"
          }</button>}
      </div>
  )
}

export default PostCommentBtn
