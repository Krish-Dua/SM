import usePostStore from '../store/posts'
import HomeMainContent from '../components/HomeMainContent'
import React, { useEffect,useCallback,useState, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ReelPage from './ReelPage'

const PostPage = () => {
  const {postId}=useParams()
  const postPageArray=usePostStore((state)=>state.postPageArray)
const setPostPageArray=usePostStore((state)=>state.setPostPageArray)
 const location = useLocation();
  const fromExplore = location.state?.fromExplore;
  const postType=location.state?.postType;
const observerRef=useRef(null)
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);


  const fetchPost=async ()=>{
      const response = await fetch(`/api/post/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
toast.error(data.message)
      }
      else{
        setPostPageArray([data.data]);
      }
    }


const fetchRandomPosts = useCallback(async () => {
  if (loading || !hasMore) return;
  try {
    setLoading(true);
    const response = await fetch(`/api/post/exploreFeed`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exclude: postPageArray.map((p) => p._id), 
        size: 5,
        postType:"post"
      }),
    });
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
    } else {
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setPostPageArray([...postPageArray, ...data.data]);
      }
    }
  } catch (err) {
    toast.error("Error loading more posts");
  } finally {
    setLoading(false);
  }
}, [postPageArray, loading, hasMore, setPostPageArray]);


useEffect(()=>{
  window.scroll(0,0)
  console.log(fromExplore)
if (postPageArray.length<=0) {
 fetchPost()
}
},[postId])

useEffect(()=>{
if(observerRef.current) observerRef.current.disconnect()
  const loader = document.querySelector("#feed-loader");
  if (!loader || !hasMore) return

  observerRef.current = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchRandomPosts()
      }
    },
    { rootMargin: "100px" }
  );

  observerRef.current.observe(loader);

  return () => {
    if (observerRef.current) observerRef.current.disconnect();
  };
},[fetchPost,hasMore,loading])



return (
  postType && postType==="reel"?(
<ReelPage arr={postPageArray} />

  ):(<div>
<HomeMainContent posts={postPageArray || []} />
{fromExplore && 
 <div id="feed-loader" className="text-center py-4 text-gray-500">
            {loading ? "Loading more posts..." : !hasMore ? "No more posts" : ""}
          </div>}
</div>  )
);

}

export default PostPage
