import FollowUnfollwBtn from '../components/FollowUnfollwBtn';
import React,{useState,useEffect, use} from 'react'
import { Link } from 'react-router-dom';
const Suggestions = () => {
  const [suggestedUsers,SetSuggestedUsers]=useState([])
 const fetchSuggestedUsers=async()=>{
  const response = await fetch("http://localhost:3000/api/user/suggestions?size=15", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
alert(data.message)
      }
      else{
       SetSuggestedUsers(data.data)
      }
 }  

useEffect(() => {
    fetchSuggestedUsers();
    },[])

  return (
 <main className='max-w-md h-max mx-auto p-4 ' >
    <h1 className='text-center font-bold mb-6 text-2xl' >Suggestions for you </h1>
   <div className="shadow-md rounded-lg p-3">
          {suggestedUsers.map((user) => (

            <div key={user.username} className="mb-3 p-2 flex items-center justify-between last:mb-0  rounded-lg">
             <Link to={user.username} >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white text-black">{user.name}</p>
                  <p className="text-xs text-gray-300">{user.username}</p>
                </div>
              </div>
</Link>

<FollowUnfollwBtn targetUserId={user._id} classname={"text-xs px-3 py-1 border  border-gray-300 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"} />
            
            </div>
          ))}
        </div>
 </main>
  )
}

export default Suggestions
