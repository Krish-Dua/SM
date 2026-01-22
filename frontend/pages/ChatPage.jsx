import { useChatStore } from '../store/chat'
import ChatBox from '../components/ChatBox'
import ConversationList from '../components/ConversationList'
import React, { use, useEffect } from 'react'

const ChatPage = () => {

  const {clearActiveConversation ,activeConversation}=useChatStore()

useEffect(()=>{
return()=>{
  clearActiveConversation()
}
},[])

  return (
     <main className="flex items-center w-full h-[100dvh] justify-center">
      {/* Desktop: Always show both */}
      <section className="hidden md:flex h-[100dvh] w-[30%] lg:border-r border-gray-800">
        <ConversationList />
      </section>

      <section className="hidden md:flex w-full flex-1 h-[100dvh]">
        <ChatBox />
      </section>

      {/* Mobile view */}
      <section className="block md:hidden w-full h-full">
        {activeConversation ? <ChatBox /> : <ConversationList />}
      </section>
    </main>
  )
}

export default ChatPage
