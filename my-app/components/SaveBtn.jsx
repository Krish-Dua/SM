import {Bookmark} from 'lucide-react'
import React, { use } from 'react'
import useUserStore from "../store/user";


const SaveBtn = ({postId,children}) => {
const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
const [loading, setLoading] = React.useState(false);


    const handleSave = async()=>{
if (loading) return;
 setLoading(true);
      const response = await fetch(`http://localhost:3000/api/user/save/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
alert(data.message)
      }
    else {
  if (data.success) {
    if (data.message === "saved") {
      setUser({ ...user, saved: [...user.saved, postId] });
    }
    if (data.message === "unsaved") {
      setUser({ ...user, saved: user.saved.filter(id => id.toString() !== postId) });
    }
  }
}
setLoading(false);


}
 
    

  return (
    <div role='button' onClick={handleSave} >
{children? children : <Bookmark fill={user.saved.includes(postId)?"white":""} />}
    </div>
  )
}

export default SaveBtn
