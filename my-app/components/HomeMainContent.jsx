import React from 'react'
import Post from './Post'
import Reel from './Reel'

const HomeMainContent = ({posts}) => {
  return (
    <div className='max-w-2xl h-max mb-20  mx-auto'>

<div className="text-2xl flex justify-center mt-2 text-black font-bold dark:text-gray-300 mb-3">
            E-CONN
          </div>
<div className=''>

{posts.map((post)=>{ 
  return(
post.postType==="reel"?
(
<Reel key={post._id} reel={post}/>
)
:
(
<Post post={post} key={post._id}/>

)


)
})}

</div>






    </div>
  )
}

export default HomeMainContent
