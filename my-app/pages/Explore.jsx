import React, { useState, useEffect, use, useRef } from "react";
import { CircleXIcon ,ImageIcon,PoundSterlingIcon,Video} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import usePostStore from "../store/posts";
import { toast } from "react-toastify";

const Explore = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const explorePosts=usePostStore((state)=>state.explorePosts)
  const setExplorePosts=usePostStore((state)=>state.setExplorePosts)
const setPostPageArray=usePostStore((state)=>state.setPostPageArray)

const navigate=useNavigate()
  
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
const observerRef=useRef(null)

 const handleThumbnailOnClick=(postId,postType)=>{
  //  const index = explorePosts.findIndex(post => post._id === postId);
  // const remainingPosts = explorePosts.slice(index);
   const remainingPosts = explorePosts.filter(post => post._id === postId);
  console.log(remainingPosts)
setPostPageArray(remainingPosts)
console.log(postType)
navigate(`/p/${postId}`,{
  state:{fromExplore:true,postType}
})
  }

  const fetchSearchedUsers = async (input) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/search/?username=${input}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (!data.success) {
      // alert(data.message);
      setUsers([])
    } else {
      console.log(data);
      setUsers(data.data);
    }
  };

  const fetchExplorePosts = async () => {
     if (loading || !hasMore) return;
     try {
       setLoading(true);
       const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/post/exploreFeed`, {
         method: "POST",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           exclude: explorePosts.map((p) => p._id), 
           size: 21,
         }),
       });
       const data = await response.json();
       if (!data.success) {
         toast.error(data.message);
       } else {
         if (data.data.length === 0) {
           setHasMore(false);
         } else {
           setExplorePosts([...explorePosts, ...data.data]);
         }
       }
     } catch (err) {
       toast.error("Error loading more posts");
     } finally {
       setLoading(false);
     }
  }
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const loader = document.querySelector("#feed-loader");
    if (!loader || !hasMore) return
  
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchExplorePosts();
        }
      },
      { rootMargin: "100px" }
    );
  
    observerRef.current.observe(loader);
 return () => {
    if (observerRef.current) observerRef.current.disconnect();
  };
},[fetchExplorePosts,hasMore,loading])

  




  useEffect(() => {
    if (explorePosts.length<=0) {
      fetchExplorePosts();
    }
  }, []);
  
  useEffect(() => {
    if (search.length <= 0) {
      setUsers([]);
      setIsSearchActive(false);
      return;
    }
  
    setIsSearchActive(true);
  
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
  
    return () => clearTimeout(timer);
  }, [search]);
  
  useEffect(() => {
    if (debouncedSearch) {
      console.log("Call API with:", debouncedSearch);
      fetchSearchedUsers(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return (
    <>
      <main className="max-w-5xl mb-19 sm:py-4 sm:px-4 h-max sm:h-max mx-auto">
        <header className="flex justify-center">
          <div className="w-[80%] relative  mb-6">
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="bg-slate-900 border-0 mt-4 sm:mt-0 text-lg w-full py-2 pl-2 pr-12 rounded-xl"
              type="text"
            />
            {isSearchActive && (
              <CircleXIcon
                onClick={() => {
                  setSearch("");
                  setUsers([]);
                }}
                className="absolute right-2 bottom-2"
              />
            )}
          </div>
        </header>
  
        {!isSearchActive ? (
          <section className="grid grid-cols-3 w-full gap-1 ">
            {explorePosts.map((post, index) => {
              if (post.mediaType === "video") 
                return (
                  <div onClick={()=>handleThumbnailOnClick(post._id,post.postType)} key={post._id} className="relative">
                    <video
                      className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "
                      muted
                    >
                      <source src={post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <Video className="absolute right-3 top-3 shadow-2xl" />
                  </div>
                );
              else
                return (
                  <div onClick={()=>handleThumbnailOnClick(post._id,post.postType)} className="relative" key={post._id}>
                    <img
                      className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "
                      src={post.media}
                      alt=""
                    />
                    <ImageIcon className="absolute right-3 top-3  shadow-black" />
                  </div>
                );
            })}
          </section>
        ) : (
          <section>
            {users.map((user, index) => {
              return (
                <Link
                  key={user.username}
                  to={`/${user.username}`}
                  className="mb-3 p-2 flex items-center justify-between last:mb-0  rounded-lg"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white text-black">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-300">{user.username}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
        <div id="feed-loader" className="text-center py-4 text-gray-500">
          {loading ? "Loading more posts..." : !hasMore ? "No more posts" : ""}
        </div>
      </main>
    </>
  );
};
  
export default Explore;
    