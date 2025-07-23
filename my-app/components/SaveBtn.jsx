import {Bookmark} from 'lucide-react'
import React, { use } from 'react'
import useUserStore from "../store/user";
import { toast } from 'react-toastify';


const SaveBtn = ({postId,children}) => {
const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
const [loading, setLoading] = React.useState(false);


    const handleSave = async()=>{
if (loading) return;
 setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/save/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
toast.error(data.message)
      }
    else {
  if (data.success) {
    if (data.message === "saved") {
      setUser({ ...user, saved: [...user.saved, postId] });
      toast.success(data.message,{
        autoClose:1000,
        pauseOnHover:false,
        hideProgressBar:true
      })
    }
    if (data.message === "unsaved") {
      setUser({ ...user, saved: user.saved.filter(id => id.toString() !== postId) });
      toast.success(data.message,{
        autoClose:1000,
        pauseOnHover:false,
        hideProgressBar:true
      })
    }
  }
}
setLoading(false);


}
 
    

  return (
    <div role='button' onClick={handleSave} >
{children? children : <Bookmark fill={user.saved.includes(postId)?"white":"transparent"} />}
    </div>
  )
}

export default SaveBtn
