import React, { useEffect } from 'react'
import { useChatStore } from '../store/chat'
import '../src/App.css'
import useUserStore from '../store/user'
import { ArrowLeft ,MessageCircleCode} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewChatDialog from './NewChatDialog'
const ChatBox = () => {
  const [input,setInput]=React.useState("")
  const {activeConversation,fetchMessages,clearActiveConversation,updateConversation,sendMessage,messages}=useChatStore()
 const user= useUserStore((state)=>state.user)
  const [dialogOpen,setDialogOpen]=React.useState(false)

useEffect(()=>{
  if (activeConversation) {
fetchMessages(activeConversation._id)}
},[activeConversation])
    

if (!activeConversation) {
  return(
    <div className='flex flex-col mt-60 border-gray-500 gap-1 border-l-1 justify-center items-center'>
<MessageCircleCode size={90} />
<p className='text-lg' >Your messages</p>
<p className='text-xl font-bold text-blue-500 ' > Select a conversation to start a chat</p>
  <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
      <DialogTrigger asChild>
<button className='bg-blue-600 rounded-xl py-1 px-2' >New Chat</button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[60%] custom-scrollbar overflow-auto  dark:bg-black border-0  text-white">
        <DialogTitle className={"text-center"} >
          New message
        </DialogTitle>
        <NewChatDialog setOpen={setDialogOpen} />
      </DialogContent>
    </Dialog>
    </div>
  )
}

  return (
    <main className='h-full w-full border-gray-500 border-l-1 flex flex-col ' >
      <header className='border-b-1 flex gap-4 items-center border-gray-400 p-3' >
      <ArrowLeft onClick={()=>{
        clearActiveConversation()
      }} />
      <Link to={`/${activeConversation?.receiver.username}`} className='flex items-center gap-4' >
        <img src={activeConversation?.receiver.avatar || "/default-avatar.png"} className='h-12 w-12 rounded-full object-cover' alt="" />
        <p className='text-xl font-bold'>{activeConversation?.receiver.username}</p>
        </Link>
      </header>


      <section className='flex-1 flex flex-col-reverse gap-4 py-6 px-2 overflow-auto custom-scrollbar'>
 {messages.map((msg) => (
  <div
  key={msg._id}
  className={`flex items-end gap-2 w-full ${
    msg.sender._id === user._id ? "justify-end" : "justify-start"
  }`}
>
  {msg.sender._id !== user._id && (
    <img
      src={msg.sender.avatar || "/default-avatar.png"}
      className="h-8 w-8 rounded-full object-cover"
      alt=""
    />
  )}
  <div
    className={`max-w-md p-2 break-words rounded-xl ${
      msg.sender._id === user._id
        ? "bg-blue-500 text-white"
        : "bg-gray-800 text-white"
    }`}
  >
    {msg.msg}
  </div>
</div>

  ))}
      </section>
   <footer className="p-4 border-t border-gray-400">
  <div className="relative w-full">
    <textarea
      spellCheck="false"
      rows="1"
      value={input}
      onChange={(e) => {
        setInput(e.target.value);
      }}
      placeholder="Type a message"
      className="bg-gray-900 w-full p-3 pr-12 rounded-2xl outline-0 text-white resize-none overflow-hidden"
      onInput={(e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
    />
   {input.trim().length!=0&& <button
   onClick={()=>{
sendMessage(activeConversation._id,input)
setInput("")
 updateConversation({
  _id:activeConversation._id,
  receiver:activeConversation.receiver,
  lastMsg:input,
  updatedAt:new Date()
 })
   }}
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 "
    >
      Send
    </button>}
  </div>
</footer>

    </main>
  )
}

export default ChatBox
