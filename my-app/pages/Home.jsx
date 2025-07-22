import React, { useEffect, useState } from "react";
import useUserStore from "../store/user";
import RightSidebar from "../components/RightSidebar";
import HomeMainContent from "../components/HomeMainContent";
import Header from "../components/Header";
import { toast } from "react-toastify";
import usePostStore from "../store/posts";


const Home = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
const feedPosts=usePostStore((state)=>state.feedPosts)
const setFeedPosts=usePostStore((state)=>state.setFeedPosts)
const homeSuggestedUsers=usePostStore((state)=>state.homeSuggestedUsers)
const setHomeSuggestedUsers=usePostStore((state)=>state.setHomeSuggestedUsers)

const fetchPosts=async ()=>{
    // setloading(true);
    console.log(" pc")
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/feed`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
toast.error(data.message)
      }
      else{
      //  SetPosts(data.data)
      setFeedPosts(data.data)
      }
      // setLoading(false);
    }

 const fetchSuggestedUsers=async()=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/suggestions`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
alert(data.message)
      }
      else{
       setHomeSuggestedUsers(data.data)
      }
 }   

useEffect( () => {
  if (feedPosts.length<=0) {
    fetchPosts();
  }
  if (homeSuggestedUsers.length<=0) {
    
    fetchSuggestedUsers();
  }

  }, [])

  return (
    <>
    {/* header  */}

<Header/>
      <div className="flex min-h-screen">
          <div className="flex-1">
            <HomeMainContent posts={feedPosts} />
          </div>
          <div>   
            <RightSidebar suggestedUsers={homeSuggestedUsers} />
          </div>
      </div>
    </>
  );
};

export default Home;
