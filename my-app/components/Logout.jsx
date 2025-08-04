import React,{use, useState}from "react";
import useUserStore from "../store/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LoaderSpinner from "./LoaderSpinner";
import useNotificationStore from "../store/notification";
import usePostStore from "../store/posts";
import { useChatStore } from "../store/chat";


const Logout = ({classname}) => {
      const [loading, setloading] = useState(false);
    
    const setUser = useUserStore((state) => state.setUser); 
    const setNotifications=useNotificationStore((state)=>state.setNotifications);
    const setFeedPosts=usePostStore((state)=>state.setFeedPosts)
    const setExplorePosts=usePostStore((state)=>state.setExplorePosts)
    const setHomeSuggestedUsers=usePostStore((state)=>state.setHomeSuggestedUsers)
    const setPostPageArray=usePostStore((state)=>state.setPostPageArray)
const {resetChatState}=useChatStore()



    const handleSubmit = async () => {
        setloading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
      setUser()
      setNotifications([])
      setFeedPosts([])
      setExplorePosts([])
      setHomeSuggestedUsers([])
      setPostPageArray([])
        resetChatState()
    
        setloading(false);
    }

  return (
     <AlertDialog>
      <AlertDialogTrigger asChild>
              <button className={`${classname}`}>Logout</button>

      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }} >{loading ? <LoaderSpinner size={20} /> : "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;
