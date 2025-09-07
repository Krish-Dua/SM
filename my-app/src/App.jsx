import './App.css'
import React,{useState,useEffect} from 'react'
import {Route,Routes} from 'react-router-dom'
import Authpage from '../pages/Authpage'
import Home from '../pages/Home'
import UserProfile from '../pages/UserProfile'
import useUserStore from '../store/user'
import { Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Explore from '../pages/Explore'
import Suggestions from '../pages/Suggestions'
import PostPage from '../pages/PostPage'
import { toast } from 'react-toastify'
import ReelPage from '../pages/ReelPage'
import socket from './lib/socket'
import useNotificationStore from '../store/notification'
import Notifications from '../pages/Notifications' 
import LoaderSpinner from '../components/LoaderSpinner'
import ChatPage from '../pages/ChatPage'
import { useChatStore } from '../store/chat'
import ErrorPage from '../pages/ErrorPage'

function App() {

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setloading] = useState(false);
const addNotification=useNotificationStore((state)=>state.addNotification)

  useEffect( () => {
    setloading(true);
    const fetchUser=async ()=>{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/me`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {

      }
      else{
        console.log(data);
        setUser(data.data);
      }
      setloading(false);
    }
    fetchUser();
  }, [])
  
useEffect(() => {
  if (!user?._id) return;

  socket.connect();
  socket.emit("joinRoom", user._id);

  const handleReceiveMessage = (msg) => {
    console.log("message received", msg);
    const activeConvo = useChatStore.getState().activeConversation;
    if (activeConvo && activeConvo._id === msg.conversationId) {
      useChatStore.getState().addMessage(msg);
    } 
      useChatStore.getState().updateConversation({
        _id: msg.conversationId,
        receiver: msg.sender, 
        lastMsg: msg.msg,
        updatedAt: msg.createdAt
      });
    
  };

  const handleNotification = (notification) => {
    let msg;
    if (notification.type === "follow") {
      msg = `${notification.sender.username} started following you`;
    } else if (notification.type === "like") {
      msg = `${notification.sender.username} liked your post`;
    } else if (notification.type === "comment") {
      msg = `${notification.sender.username} commented on your post`;
    }
    toast.info(msg, {
      pauseOnFocusLoss: false,
      autoClose: 4000,
      pauseOnHover: false,
    });
    addNotification(notification);
  };

  socket.on("receive_message", handleReceiveMessage);
  socket.on("newNotification", handleNotification);
socket.on("updateOnlineUsers", (users) => {
  useChatStore.getState().setOnlineUsers(users);
  console.log(users)
});

socket.on("typing",(userId)=>{
useChatStore.getState().setTyping(userId,true)
console.log("rec typ")
})
socket.on("stop_typing",(userId)=>{
  useChatStore.getState().setTyping(userId,false)
  console.log("rec stop typ")
})


  return () => {
    socket.off("receive_message", handleReceiveMessage);
    socket.off("newNotification", handleNotification);
    socket.off("updateOnlineUsers");
    socket.off("typing");
    socket.off("stop_typing");
  };
}, [user?._id]);

if (loading) {
  return(
    <div className=' h-screen flex flex-col gap-4 items-center justify-center text-white bg-black'>
      <h1 className='text-7xl' >E-Conn</h1>
      <LoaderSpinner size={30}/>
    </div>
  )
}


  return (
  <>
    <Routes >
        {/* Protected Routes with Sidebar */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/auth" />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore /> } />
          <Route path=':username' element={<UserProfile/>}/>
          <Route path='p/:postId' element={<PostPage/>}/>
          <Route path='reels' element={<ReelPage/>}/>
          <Route path="suggestions" element={<Suggestions/>} />
          <Route path="notifications" element={<Notifications/>} />
          <Route path="chat" element={<ChatPage/>} />
          <Route path='*' element={<ErrorPage/>}/>
        </Route>

        {/* Auth Route (Without Sidebar) */}
        <Route path="/auth" element={!user ? <Authpage /> : <Navigate to="/" />} />
      </Routes>
  </>
  )
}

export default App
