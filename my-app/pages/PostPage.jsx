import usePostStore from '../store/posts'
import HomeMainContent from '../components/HomeMainContent'
import React from 'react'

const PostPage = () => {
  const postPageArray=usePostStore((state)=>state.postPageArray)
const setPostPageArray=usePostStore((state)=>state.setPostPageArray)
  return (
   <HomeMainContent posts={postPageArray} />
  )
}

export default PostPage
