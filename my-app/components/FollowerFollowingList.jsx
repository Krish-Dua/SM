import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import FollowUnfollwBtn from './FollowUnfollwBtn'
const FollowerFollowingList = ({query,userId}) => {
const [data,setData]= React.useState([])
const [loading,setLoading]= React.useState(false)

const fetchdata= async()=>{
    setLoading(true)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/followersOrFollowing?query=${query}&userId=${userId} `,{
        method:"GET",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data= await response.json()
    if(!data.success){
    toast.error(data.message)
    }else{
        console.log(data)
        setData(data.data)
    }
    setLoading(false)
}

useEffect(()=>{
fetchdata()
},[query])

  return (
  <main className='w-full  ' >

{data.length===0&&!loading ?(<h1>No {query} Yet</h1> ):(
     <div className="shadow-md h-full w-full  rounded-lg p-3">
          {data.map((user) => (

            <div key={user.username} className="mb-3 p-2 flex items-center justify-between last:mb-0  rounded-lg">
             <Link to={`/${user.username}`} >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white text-black">{user.username}</p>
                  <p className="text-xs text-gray-300">{user.user}</p>
                </div>
              </div>
</Link>

<FollowUnfollwBtn targetUserId={user._id} classname={"text-xs px-3 py-1 border  border-gray-300 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"} />
            
            </div>
          ))}
        </div>
)}
  </main>
        
  )
}
export default FollowerFollowingList
