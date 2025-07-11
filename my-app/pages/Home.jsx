import React, { useEffect, useState } from "react";
import useUserStore from "../store/user";
import RightSidebar from "../components/RightSidebar";
import HomeMainContent from "../components/HomeMainContent";
import Header from "../components/Header";


const Home = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [posts,SetPosts]=useState([])
  const [suggestedUsers,SetSuggestedUsers]=useState([])

const fetchPosts=async ()=>{
    // setloading(true);
      const response = await fetch("http://localhost:3000/api/post/feed", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
alert(data.message)
      }
      else{
       SetPosts(data.data)
      }
      // setloading(false);
    }

 const fetchSuggestedUsers=async()=>{
  const response = await fetch("http://localhost:3000/api/user/suggestions", {
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

useEffect( () => {
  fetchPosts();
  fetchSuggestedUsers();

  }, [])

  return (
    <>
    {/* header  */}

<Header/>
      <div className="flex min-h-screen">
          <div className="flex-1">
            <HomeMainContent posts={posts} />
          </div>
          <div>   
            <RightSidebar suggestedUsers={suggestedUsers} />
          </div>
      </div>
    </>
  );
};

export default Home;
