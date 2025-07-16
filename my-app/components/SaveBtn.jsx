import {Bookmark} from 'lucide-react'
import React, { use } from 'react'
import useUserStore from "../store/user";


const SaveBtn = ({postId,saved,setSaved}) => {
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
      else{
      if (data.success) {
      if (data.message==="saved") {
        user.saved.push(postId);
      }
      if (data.message==="unsaved") {
        user.saved = user.saved.filter(id => id.toString() !== postId);
      }
}
}
setLoading(false);


}
 
    

  return (
    <button onClick={handleSave} >
      <Bookmark fill={user.saved.includes(postId)?"white":""} />
    </button>
  )
}

export default SaveBtn
