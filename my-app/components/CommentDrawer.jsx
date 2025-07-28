import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { MessageCircleMore ,Trash} from "lucide-react";
import "../src/App.css"
import PostCommentBtn from "./PostCommentBtn";
import useUserStore from "../store/user";
import {toast } from 'react-toastify';
import { formatTime } from "@/lib/dayjs";
import { Link } from "react-router-dom";

const CommentDrawer = ({ postId ,setCommentCount}) => {
const user= useUserStore((state)=>state.user)
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

const handleDeleteComment= async (commentId) => {
  if 
  (loading) return;
  setloading(true);
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/comment/${commentId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if(!data.success) {
    // alert(data.message);
    toast.error(data.message)
  } else {
    toast.success("Comment Deleted",{
      autoClose:2000
    })
    setComments(comments.filter(c => c._id !== commentId));
    setCommentCount(prev => prev - 1);
  }
  setloading(false);
}

  const fetchComments =async  () => {
     setloading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/comments/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
        toast.error(data.message)
      }
      else{
       setComments(data.data)
      }
      setloading(false);

  
   
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) fetchComments();
      else setComments([])
    }}>
      <DrawerTrigger asChild>
        <button><MessageCircleMore/></button>
      </DrawerTrigger>

      <DrawerContent  className="h-[80%] max-w-3xl  dark:bg-gray-950 dark:text-white mx-auto p-4">
        <h2 className="font-bold text-xl  my-2 text-center ">Comments</h2>
       <div className="overflow-auto custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((c,ind) => (
    
            <div key={ind} className="mb-3 p-2 flex items-center  justify-between last:mb-0  rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={c.commentedBy.avatar || "/default-avatar.png" } 
                    alt={c.commentedBy.username} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <div className="flex gap-14 items-center " >
                    <div className="flex items-center gap-4" >
                <Link to={c.commentedBy.username} > <p className="text-md font-medium dark:text-white text-black">{c.commentedBy.username}</p></Link>                   <span className="text-xs text-gray-400" >{formatTime(c.createdAt)}</span>
                </div>

                  {user._id===c.commentedBy._id?<Trash onClick={()=>{
                    handleDeleteComment(c._id)
                  }} size={17} />: <></>}
                  </div>
                  <p className="text-sm text-gray-300">{c.content}</p>
                </div>
              </div>
             
            </div>
            
          ))
          
        ): (
          <p>No comments yet.</p>
        )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
        <PostCommentBtn setCommentCount={setCommentCount} setComments={setComments}  postId={postId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentDrawer