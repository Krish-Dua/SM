import React,{useState}from "react";
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

const Logout = ({classname}) => {
      const [loading, setloading] = useState(false);
    
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser); 

    const handleSubmit = async () => {
        setloading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
      setUser()
        
    
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
