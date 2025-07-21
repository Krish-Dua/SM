import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useUserStore from "../store/user";
import { Link, useNavigate } from "react-router-dom";
import SaveBtn from "./SaveBtn";
import FollowUnfollwBtn from "./FollowUnfollwBtn";
import { toast } from "react-toastify";
import usePostStore from "../store/posts";


const PostOptionsBtn = ({postedBy,postId ,post}) => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
const setPostPageArray=usePostStore((state)=>state.setPostPageArray)
const navigate=useNavigate()
    const [loading, setLoading] = React.useState(false);
const isCreator = user._id === postedBy._id;

    const handleDelete = async () => {
        const response = await fetch(`http://localhost:3000/api/post/${postId}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!data.success) {
            alert(data.message);
            toast.error(data.message)
        } else {
            toast.success("post deleted",{
              hideProgressBar:true,
              pauseOnHover:false,
              autoClose:1000
            })
            window.location.reload();
        }
    }


  return (
      <Popover>
        <PopoverTrigger>. . .</PopoverTrigger>
        <PopoverContent className="flex flex-col border-0 gap-0 dark:bg-gray-800 bg-white p-0 rounded-lg shadow-lg overflow-hidden">
        
          {isCreator&&
              <button
            onClick={handleDelete}
            className="w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          >
            Delete Post
          </button>
          }

  {!isCreator&&
        <FollowUnfollwBtn  targetUserId={postedBy._id} classname={"w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"} />
  }
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.href}p/${postId}`)}
            className="w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          >
            Copy Link
          </button>

          <SaveBtn postId={postId}>
            <button
            className="w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          >
            {user.saved.includes(postId) ? "Unsave Post" : "Save Post"}
          </button>
          </SaveBtn>


          <button onClick={()=>{
            setPostPageArray([post])
            navigate(`/p/${postId}`)
          }}
            className="w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          >
            Go to Post
          </button>

          <Link
              to={`/${postedBy.username}`}
            className="w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Go to creator page
          </Link>
        </PopoverContent>
      </Popover>
  );
};

export default PostOptionsBtn;
