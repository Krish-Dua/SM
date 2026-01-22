import React from 'react'
import Post from './Post'

const HomeMainContent = ({posts}) => {
React.useEffect(() => {
    const videos = document.querySelectorAll("video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
    };
  }, [posts]);


  return (
    <div className='max-w-[550px] h-max mb-0 mx-auto'>

<div className="text-2xl flex justify-center mt-2 text-black font-bold dark:text-gray-300 mb-3">
            CONNECTICX
          </div>
<div className=''>

{posts.map((post)=>{ 
  return(
<Post post={post} key={post._id}/>
)
})}

</div>






    </div>
  )
}

export default HomeMainContent
