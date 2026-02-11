import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/chat'
import '../src/App.css'
import useUserStore from '../store/user'
import { ArrowLeft, MessageCircleCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import socket from '@/lib/socket'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewChatDialog from './NewChatDialog'

const ChatBox = () => {
  const [input, setInput] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [page, setPage] = useState(1)

  const {
    activeConversation,
    fetchMessages,
    clearActiveConversation,
    updateConversation,
    typingUsers,
    onlineUsers,
    sendMessage,
    messages,
    hasMoreMessages,
    loadingMessages
  } = useChatStore()

  const user = useUserStore((state) => state.user)

  const topSentinelRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const isTypingEmmitted = useRef(false)

  

useEffect(() => {
  if (activeConversation) {
    setInput("")
    setPage(1);
  }
}, [activeConversation]);

// Fetch messages whenever page or conversation changes
useEffect(() => {
  if (activeConversation) {
    fetchMessages(activeConversation._id, page, 15);
  }
}, [activeConversation, page, fetchMessages]);


  
  useEffect(() => {
    if (!activeConversation) return
    const sentinel = topSentinelRef.current
    if (!sentinel || !hasMoreMessages) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMessages && hasMoreMessages) {
          setPage((prev) => prev + 1)
        }
      },
      { rootMargin: "100px" }
    )

    observer.observe(sentinel)
    return () => {
      if (observer && sentinel) observer.unobserve(sentinel)
    }
  }, [loadingMessages, hasMoreMessages, activeConversation])

  
  if (!activeConversation) {
    return (
      <div className="flex items-center w-full justify-center flex-col border-l border-gray-300 dark:border-gray-700 gap-1 bg-white dark:bg-black text-black dark:text-white">
        <MessageCircleCode size={90} className="text-gray-400 dark:text-gray-600" />
        <p className="text-lg">Your messages</p>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Select a conversation to start a chat
        </p>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-1 px-2 transition">
              New Chat
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[60%] custom-scrollbar overflow-auto dark:bg-black border-0 text-black dark:text-white">
            <DialogTitle className="text-center text-black dark:text-white">New message</DialogTitle>
            <NewChatDialog setOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <main className="h-[100dvh] w-full border-0 md:border-l md:border-gray-300 dark:md:border-gray-700 flex flex-col bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-300 dark:border-gray-700 p-3 flex gap-4 items-center">
        <ArrowLeft onClick={clearActiveConversation} className="cursor-pointer hover:opacity-80 transition" />
        <Link
          to={`/${activeConversation?.receiver?.username}`}
          className="flex items-center gap-4"
        >
          <div className="relative h-12 w-12">
            <img
              src={activeConversation?.receiver?.avatar || "/default-avatar.png"}
              className="h-12 w-12 rounded-full object-cover"
              alt=""
            />
            {onlineUsers?.includes(activeConversation?.receiver?._id) && (
              <div className="h-4 w-4 bg-green-600 absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900"></div>
            )}
          </div>
          <p className="text-xl font-bold text-black dark:text-white">{activeConversation?.receiver?.username}</p>
        </Link>
      </header>

      {/* Messages */}
      <section className="flex-1 flex flex-col-reverse gap-4 py-6 px-2 overflow-auto custom-scrollbar bg-white dark:bg-black">

        {/* Typing indicator */}
        {typingUsers?.includes(activeConversation?.receiver?._id) && (
          <div className="flex items-center gap-2 w-full justify-start">
            <img
              src={activeConversation?.receiver?.avatar || "/default-avatar.png"}
              className="h-8 w-8 rounded-full object-cover"
              alt=""
            />
            <div
              className="flex items-end gap-2"
              role="status"
              aria-live="polite"
              aria-label="Typing…"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0ms]" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:150ms]" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Messages list */}
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
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
              }`}
            >
              {msg.msg}
            </div>
          </div>
        ))}
        <div ref={topSentinelRef} />
        
        {/* Loading + End of messages */}
        {loadingMessages && (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading more messages...</div>
        )}
        {!hasMoreMessages && (
          <div className="text-center text-gray-500 dark:text-gray-400">No more messages</div>
        )}
      </section>

      {/* Footer */}
      <footer
        className={`${isSearchActive ? "mb-0" : "sm:mb-0 mb-10"} p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-black`}
      >
        <div className="relative w-full">
          <textarea
            spellCheck="false"
            rows="1"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)

              if (!isTypingEmmitted.current && e.target.value.trim().length > 0) {
                socket.emit("typing", {
                  roomId: activeConversation?.receiver?._id,
                  userId: user._id,
                })
                isTypingEmmitted.current = true
              }

              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
              }

              typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stop_typing", {
                  roomId: activeConversation?.receiver?._id,
                  userId: user._id,
                })
                isTypingEmmitted.current = false
              }, 2000)
            }}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
            placeholder="Type a message"
            className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-700 w-full p-3 pr-17 rounded-2xl max-h-[150px] outline-0 resize-none overflow-y-auto placeholder:text-gray-600 dark:placeholder:text-gray-400"
            onInput={(e) => {
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
            }}
          />
          {input.trim().length !== 0 && (
            <button
              type="button"
              onClick={() => {
                sendMessage(activeConversation._id, input)
                setInput("")
                updateConversation({
                  _id: activeConversation._id,
                  receiver: activeConversation.receiver,
                  lastMsg: input,
                  updatedAt: new Date(),
                })
              }}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition font-medium"
            >
              Send
            </button>
          )}
        </div>
      </footer>
    </main>
  )
}

export default ChatBox
