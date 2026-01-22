import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { MessageCircleMore ,Trash} from "lucide-react";
import "../src/App.css"
import PostCommentBtn from "./PostCommentBtn";
import useUserStore from "../store/user";
import {toast } from 'react-toastify';
import { CommentItem } from "./CommentItem";


const CommentDrawer = ({ postId ,setCommentCount}) => {
const user= useUserStore((state)=>state.user)
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

const handleDeleteComment= async (commentId) => {
  if 
  (loading) return;
  setloading(true);
  const response = await fetch(`/api/post/comment/${commentId}`, {
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
      const response = await fetch(`/api/post/comments/${postId}`, {
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

   <DrawerContent className="h-[80%] max-w-3xl dark:bg-gray-950 dark:text-white mx-auto p-4">
  <h2 className="font-bold text-xl my-2 text-center">Comments</h2>
  <div className="overflow-y-auto overflow-x-hidden h-[80%] custom-scrollbar">
    {comments.length > 0 ? (
      comments.map((c, ind) => (
        <CommentItem
      key={c._id}
      comment={c}
      user={user}
      onDelete={handleDeleteComment}
    />
      ))
    ) : (
      <p>No comments yet.</p>
    )}
  </div>
  <div className="absolute bottom-0 left-0 right-0 p-4">
    <PostCommentBtn setCommentCount={setCommentCount} setComments={setComments} postId={postId} />
  </div>
</DrawerContent>

    </Drawer>
  );
};

export default CommentDrawer