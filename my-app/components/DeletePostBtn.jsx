import React from 'react'
import { toast } from 'react-toastify';
import LoaderSpinner from './LoaderSpinner';
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
const DeletePostBtn = ({postId}) => {
    const [loading, setLoading] = React.useState(false);
    const [open,setOpen]=React.useState(false)

    const handleDelete = async () => {
      setLoading(true);
      try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/${postId}`, {
              method: "DELETE",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (!data.success) {
              toast.error(data.message);
              setLoading(false);
          } else {
              toast.success("post deleted",{
                hideProgressBar:true,
                pauseOnHover:false,
                autoClose:1000
              });
              history.back();
          }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }


  return (
     <AlertDialog open={open}
onOpenChange={setOpen}
 >
      <AlertDialogTrigger asChild>
          <button
              className="w-full text-center px-4 py-3 text-sm dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
            >
              Delete Post
            </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}>
            {loading ? <LoaderSpinner size={20} /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeletePostBtn
