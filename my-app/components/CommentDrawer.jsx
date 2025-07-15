import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import "../src/App.css"
import PostCommentBtn from "./PostCommentBtn";


const CommentDrawer = ({ postId ,setCommentCount}) => {
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);



  const fetchComments =async  () => {
     setloading(true);
      const response = await fetch(`http://localhost:3000/api/post/comments/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
alert(data.message)
      }
      else{
        console.log(data.data)
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
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={c.commentedBy.avatar} 
                    alt={c.commentedBy.username} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-md font-medium dark:text-white text-black">{c.commentedBy.username}</p>
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