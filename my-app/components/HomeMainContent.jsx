import React from 'react'
import Post from './Post'
import { toast } from 'react-toastify';
const HomeMainContent = ({posts}) => {
  return (
    <div className='max-w-2xl h-max  mx-auto'>

<div  onClick={()=>{
toast.success("yoyoji",{
  // position:"top-right"
})
}} className="text-2xl flex justify-center text-black font-bold dark:text-gray-300 mb-3">
            E-CONN
          </div>
<div className=''>

{posts.map((post)=>{ 
  return(
<Post post={post} key={post._id}/>)
})}

</div>






    </div>
  )
}

export default HomeMainContent
