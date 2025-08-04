import { useChatStore } from '../store/chat'
import ChatBox from '../components/ChatBox'
import ConversationList from '../components/ConversationList'
import React, { use, useEffect } from 'react'

const ChatPage = () => {

  const {clearActiveConversation}=useChatStore()

useEffect(()=>{
return()=>{
  clearActiveConversation()
}
},[])

  return (
    <main className='flex items-center w-full h-[100dvh] justify-center' >


<section className=' h-full w-[30%]' >
<ConversationList/>
</section>


<section className='flex-1 h-full ' >
<ChatBox/>
</section>


    </main>
  )
}

export default ChatPage
