import React, { useEffect, useRef, useState, useCallback } from "react";
import useUserStore from "../store/user";
import RightSidebar from "../components/RightSidebar";
import HomeMainContent from "../components/HomeMainContent";
import Header from "../components/Header";
import { toast } from "react-toastify";
import usePostStore from "../store/posts";
import useNotificationStore from "../store/notification";
const Home = () => {
  const user = useUserStore((state) => state.user);
  const feedPosts = usePostStore((state) => state.feedPosts);
  const setFeedPosts = usePostStore((state) => state.setFeedPosts);
  const homeSuggestedUsers = usePostStore((state) => state.homeSuggestedUsers);
  const setHomeSuggestedUsers = usePostStore((state) => state.setHomeSuggestedUsers);
const setNotications=useNotificationStore((state)=>state.setNotifications)
const notications=useNotificationStore((state)=>state.notifications)

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/feed`, {
        method: "POST", 
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exclude: feedPosts.map((p) => p._id), 
          limit: 5, 
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
      } else {
        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          // const existingIds = new Set(feedPosts.map((p) => p._id));
          // const newPosts = data.data.filter((p) => !existingIds.has(p._id));
          setFeedPosts([...feedPosts, ...data.data]);
        }
      }
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [feedPosts, hasMore, loading, setFeedPosts]);

  const fetchSuggestedUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/suggestions`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) {
      alert(data.message);
    } else {
      setHomeSuggestedUsers(data.data);
    }
  };

  const fetchNotifications=async()=>{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/notifications`, {
      method:"GET",
      credentials:"include",
      headers:{
        "Content-Type":"application/json"
      }} )
      const data=await response.json();
      if(data.success){
setNotications(data.data)
      }
  }
  
  useEffect(() => {
    if (notications.length <= 0) {
      fetchNotifications();
    }
    if (feedPosts.length <= 0) fetchPosts();
    if (homeSuggestedUsers.length <= 0) fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const loader = document.querySelector("#feed-loader");
    if (!loader || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchPosts();
        }
      },
      { rootMargin: "100px" }
    );

    observerRef.current.observe(loader);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchPosts, loading, hasMore]);

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <div className="flex-1">
          <HomeMainContent posts={feedPosts} />
          <div id="feed-loader" className="text-center py-4 text-gray-500">
            {loading ? "Loading more posts..." : !hasMore ? "No more posts" : ""}
          </div>
        </div>
        <div>
          <RightSidebar suggestedUsers={homeSuggestedUsers} />
        </div>
      </div>
    </>
  );
};

export default Home;
