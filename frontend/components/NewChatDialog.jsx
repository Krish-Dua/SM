import React, {useEffect, useState } from 'react'
import useUserStore from '../store/user'
import { useChatStore } from '../store/chat'
const NewChatDialog = ({setOpen}) => {

    const user=useUserStore((state)=>state.user)
    const [suggestedUsers,setSuggestedUsers]= React.useState([])
    const [loading,setLoading]= React.useState(false)
const [search,setSearch]=useState("")
const [searchedUsers,setSearchedUsers]=useState([])
const [debouncedSearch,setDebouncedSearch]=useState("")
    
    const fetchdata= async()=>{
        setLoading(true)
        const response = await fetch(`/api/user/followersOrFollowing?query=following&userId=${user._id}&limit=15`,{
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
            setSuggestedUsers(data.data)
        }
        setLoading(false)
    }

 const  handleOnClick=async(userId)=>{
          const response = await fetch(
              `/api/chat/conversation`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  receiverId: userId,
                }),
              }
            );
            const data = await response.json();
            if (!data.success) {
              alert(data.message);
            } else {
              const convo = data.data;
              const loggedInUserId = user._id;
        
                const formattedConversation = {
              _id: convo._id,
              receiver: convo.members.find((m) => m._id !== loggedInUserId),
              lastMessage: convo.lastMessage || null,
              updatedAt: convo.updatedAt,
            };
        
            const { setActiveConversation} = useChatStore.getState();
        
            setActiveConversation(formattedConversation);
            setOpen(false)
            }
        
    }

 const fetchSearchedUsers = async (input) => {
    const response = await fetch(
      `/api/user/search/?username=${input}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!data.success) {
      // alert(data.message);
      setSearchedUsers([])
    } else {
      setSearchedUsers(data.data);
    }
  };



    useEffect(()=>{
    fetchdata()
    },[])

    useEffect(()=>{  
        if (search.length <= 0) {
            setSearchedUsers([]);
            return;
        }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
  
    return () => clearTimeout(timer);
    },[search])

     useEffect(()=>{
if (debouncedSearch) {
    fetchSearchedUsers(debouncedSearch)
}
    },[debouncedSearch])

  return (
  <main className='flex flex-col text-black  dark:text-white w-full gap-4 ' >
    <div>
    <input value={search} onChange={(e)=>{
        setSearch(e.target.value)
    }} className='dark:bg-gray-900 border-2 border-black text-black dark:text-white w-full rounded-lg p-2 outline-0 ' placeholder='Search...' type="text" />
    </div>

<p>Suggested :-</p>

<div className='' >
    {

 (searchedUsers.length > 0 ? searchedUsers : suggestedUsers).map((user)=>(
      
         <div onClick={()=>{
          handleOnClick(user._id)
         }} key={user._id} className={` px-2 py-2 flex items-center justify-between`}>
              <div className="flex items-center gap-6">
                <div className="h-13 w-13 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-md font-medium dark:text-white text-black">{user.username}</p>
                  <p className="text-sm text-gray-900 dark:text-gray-300">{user.name}</p>
                </div>
              </div>
              {/* < Dot size={50} color='blue' /> */}
            </div>
        
    ))  
    }
</div>


  </main>
  )
}

export default NewChatDialog
