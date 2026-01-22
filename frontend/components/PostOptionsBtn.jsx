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
import usePostStore from "../store/posts";
import DeletePostBtn from "./DeletePostBtn";


const PostOptionsBtn = ({postedBy,postId}) => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
const setPostPageArray=usePostStore((state)=>state.setPostPageArray)
const navigate=useNavigate()
const isCreator = user._id === postedBy._id;



  return (
      <Popover>
        <PopoverTrigger>. . .</PopoverTrigger>
        <PopoverContent className="flex flex-col border-0 gap-0 dark:bg-gray-800 bg-white p-0 rounded-lg shadow-lg overflow-hidden">
        
          {isCreator&&
          <DeletePostBtn  postId={postId} />
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
            setPostPageArray()
            navigate(`/p/${postId}`,{
              state:{fromFeed:true}
            })
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
