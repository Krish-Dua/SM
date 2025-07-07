import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import {API} from "../src/lib/utils"; // your axios setup
import { MessageCircleMore } from "lucide-react";
import "../src/App.css"


const CommentDrawer = ({ postId }) => {
  const [comments, setComments] = useState([
    {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  },
   {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  }, {
    username:"aryan.5",
    comment:"bada hokr ek aryan 5 lunga"
  },

]);
  const [open, setOpen] = useState(false);

  const fetchComments = () => {
    // API.get(`/api/comments/${postId}`)
    //   .then(res => setComments(res.data.comments))
    //   .catch(err => console.log(err));
   
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
                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    // src={c.avatar} 
                    // alt={user.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white text-black">{c.username}</p>
                  <p className="text-xs text-gray-300">{c.comment}</p>
                </div>
              </div>
             
            </div>
            
          ))
          
        ): (
          <p>No comments yet.</p>
        )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentDrawer