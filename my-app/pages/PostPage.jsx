import usePostStore from '../store/posts'
import HomeMainContent from '../components/HomeMainContent'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'


const PostPage = () => {
  const {postId}=useParams()
  const postPageArray=usePostStore((state)=>state.postPageArray)
const setPostPageArray=usePostStore((state)=>state.setPostPageArray)

  const fetchPost=async ()=>{
    console.log("cllll")
      const response = await fetch(`http://localhost:3000/api/post/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
toast.error(data.message)
      }
      else{
        console.log(data);
        setPostPageArray([data.data]);
      }
    }

useEffect(()=>{
  window.scroll(0,0)
if (postPageArray.length<=0) {
  fetchPost()
}
},[postId])
return (
<HomeMainContent posts={postPageArray} />
);

}

export default PostPage
