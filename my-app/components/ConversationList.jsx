import React, { use, useState } from 'react'
import { useChatStore } from '../store/chat'
import "../src/App.css"
import useUserStore from '../store/user'
import { Dot, PenBoxIcon } from 'lucide-react'
import NewChatDialog from './NewChatDialog'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const ConversationList = () => {
    const {conversations,fetchConversations,setActiveConversation,activeConversation}=useChatStore()
  const user=useUserStore((state)=>state.user)
  const [dialogOpen,setDialogOpen]=useState(false)


  React.useEffect(()=>{
    if (conversations.length === 0) {
        fetchConversations()
    }
  },[])
  
    return (
 <main className='w-full h-full flex flex-col gap-6 overflow-auto custom-scrollbar' >

<header  className="flex p-5 border-b-1 border-gray-400 items-center justify-between" >
<p className='text-xl text-center font-bold' >{user.username}</p>


  <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
      <DialogTrigger asChild>
<PenBoxIcon/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[60%] custom-scrollbar overflow-auto  dark:bg-black border-0  text-white">
        <DialogTitle className={"text-center"} >
          New message
        </DialogTitle>
        <NewChatDialog setOpen={setDialogOpen} />
      </DialogContent>
    </Dialog>




</header>
 
<p className='px-4 font-bold text-xl'>Messages :-</p>
<div className='flex flex-col mb-9 gap-2'>
{
    conversations.map((convo)=>(
      
         <div  onClick={()=>{
          setActiveConversation(convo)
         }} key={convo.receiver.username} className={`${activeConversation?.receiver._id===convo.receiver._id?"bg-slate-900":""} px-4 py-2 flex items-center justify-between`}>
              <div className="flex items-center gap-6">
                <div className="h-15 w-15 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={convo.receiver.avatar || "/default-avatar.png"} 
                    alt={convo.receiver.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-md font-medium dark:text-white text-black">{convo.receiver.username}</p>
                  <p className="text-sm text-gray-300">{convo.lastMsg?convo.lastMsg: convo.receiver.name}</p>
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
export default ConversationList
