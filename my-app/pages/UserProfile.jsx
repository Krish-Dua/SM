import React, { useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import {Grid,PlaySquare,Save,ImageIcon,Video} from "lucide-react"
import useUserStore from "../store/user";
import EditProfileBtn from "../components/EditProfileBtn";
import FollowUnfollwBtn from "../components/FollowUnfollwBtn";
import { toast } from "react-toastify";
import SettingsBtn from "../components/SettingsBtn";
const UserProfile = () => {
  const location = useLocation();
const queryParam=new URLSearchParams(location.search);
const tabname= queryParam.get("tab") || "all";
  const userStore = useUserStore((state) => state.user);
  const setUserStore = useUserStore((state) => state.setUser);
  const { username } = useParams();
const [user,setUser] = React.useState({
  followers: [],
  following: [],
  name: "",
  username: "",
  bio: "",
  avatar: "",
  saved: [],
});
const [userSavedPosts,setUserSavedPosts] = React.useState([]);
const [allUserPosts,setAllUserPosts] = React.useState([]);
const [userReels,setUserReels] = React.useState([]);
const [selectedTab,setSelectedTab] = React.useState(tabname);


const fetchUserProfile = async () => {
  const response = await fetch(`http://localhost:3000/api/user/profile/${username}`, {
    method: "GET",
  credentials: "include",
  headers: {
      "Content-Type": "application/json",
    },
  });
const data = await response.json();
if(!data.success){
  alert(data.message);
}
else{
  setUser(data.data)
}

}

const fetchUserPosts = async()=>{
const response = await fetch(`http://localhost:3000/api/post/postedBy/${username}`,{
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
const data = await response.json();
if(!data.success){
  alert(data.message);
} else {
  setAllUserPosts(data.data);

}
}
const fetchUserReels = async()=>{
const response = await fetch(`http://localhost:3000/api/post/postedBy/${username}/?type=reel`,{
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
const data = await response.json();
if(!data.success){
  alert(data.message);
} else {
  setUserReels(data.data);

}
}

const fetchUserSavedPosts = async()=>{
const response = await fetch(`http://localhost:3000/api/post/saved`,{
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
const data = await response.json();
if(!data.success){
  alert(data.message);
} else {
  console.log(data.data)
  setUserSavedPosts(data.data);
}
}


useEffect(() => {
  if (tabname==="saved") {
    fetchUserSavedPosts()
  }
    fetchUserProfile();
  fetchUserPosts();
}, [username]);


  return (
    <main className="max-w-4xl py-8 px-1 sm:px-4 h-max mx-auto ">


<header className="w-full flex mb-8 sm:mb-20 items-center gap-6">
        {/* profile image  */}
        <div className=" h-18 w-18 sm:h-42 sm:w-42  shrink-0 rounded-full my-auto overflow-hidden mr-2 sm:mr-10 md:mr-20">
          <img
            src={user.avatar|| "/default-avatar.png"}
            className="object-cover w-full h-full"
            alt=""
          />
        </div>

        {/* details  */}
        <section className="flex flex-col gap-6">

        {userStore.username==username?
          <div className=" hidden sm:flex  gap-6 ">
<span className="text-lg py-1 font-medium px-2">{user.username}</span>
  <EditProfileBtn setLoggedInUser={setUser} className="w-full" />
<SettingsBtn>
 <div className="px-4 py-2  rounded-lg w-full bg-gray-800">Settings</div>
</SettingsBtn>
</div>
:
<div className=" hidden sm:flex  gap-6 ">
<span className="text-lg py-1 font-medium px-4">{user.username}</span>
<FollowUnfollwBtn targetUser={user} setTargetUser={setUser} targetUserId={user._id} classname={" py-1 px-4 rounded-lg bg-gray-800"} />
<button className="py-1  px-4 rounded-lg bg-gray-800">message</button>
</div>
}
      

          <div className="flex  gap-8" >
            <div className="flex gap-1 sm:gap-2 flex-col md:flex-row">
              <span className="">{allUserPosts.length}</span>
              <span className="text-gray-400">Posts</span>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-col md:flex-row">
              <span className="">{user.followers.length}</span>
              <span className="text-gray-400">followers</span>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-col md:flex-row">
              <span className="">{user.following.length}</span>
              <span className="text-gray-400">following</span>
            </div>
          </div>

        <div className="sm:block hidden">
          <p className="font-bold">{user.name}</p>
          <p className="text-gray-300">{user.bio}</p>
        </div>

        </section>
      </header>

      <div className="sm:hidden">
          <p className="font-bold">{user.name}</p>
          <p className="text-gray-300">{user.bio}</p>
        </div>
{userStore.username==username?
 <div className="sm:hidden mt-6 flex gap-6 ">
  <EditProfileBtn setLoggedInUser={setUser} className="w-full" />
  <SettingsBtn>
 <div className="px-4 py-2  rounded-lg w-full bg-gray-800">Settings</div>
</SettingsBtn>
</div>:
 <div className="sm:hidden mt-6 flex gap-6 ">
<FollowUnfollwBtn  targetUser={user} setTargetUser={setUser} targetUserId={user._id} classname={" py-1 px-4 rounded-lg bg-gray-800"} />
 <button className="py-1  rounded-lg w-full bg-gray-800">message</button>
</div>
}
     

   
{/* tabs section */}
<section className="tabs h-20 w-full mb-5 ">
<div className="flex gap-7 w-full h-full items-center justify-evenly mid:justify-center">
<button  onClick={()=>{
  setSelectedTab("all");
}}  className={`flex gap-2 h-full items-center justify-center ${selectedTab==="all"?"border-b-1":""}`}>
<Grid/>
<span className="hidden md:block">All posts</span>
</button>
<button  onClick={()=>{
  setSelectedTab("reel");
  if (!userReels.length) {
  fetchUserReels()
    
  }
}}  className={`flex gap-2 h-full items-center justify-center ${selectedTab==="reel"?"border-b-1":""}`}>
<PlaySquare/>
<span className="hidden md:block">reels</span>
</button>
{userStore.username==username&&
<button  onClick={()=>{
  setSelectedTab("saved"); 
  if (!userSavedPosts.length) {
    console.log("yo")
    fetchUserSavedPosts();
  } 
}}  className={`flex gap-2 h-full items-center justify-center ${selectedTab==="saved"?"border-b-1":""}`}>
<Save/>
<span className="hidden md:block">saved</span>
</button>}

</div>

</section>

{/* posts grid layout  */}
<section className="grid grid-cols-3 w-full gap-1 ">


{selectedTab==="all"&&allUserPosts.map((post)=>{
 if(post.mediaType === "video")
return (
  <div key={post._id} className="relative" >
  <video  className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "muted>
    <source src={post.media} type="video/mp4" />
    Your browser does not support the video tag.
  </video> 
  <Video className="absolute right-3 top-3 shadow-2xl" />
  </div>   
)
else
return (
  <div className="relative"  key={post._id}>
  <img className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center " src={post.media} alt="" />
  <ImageIcon className="absolute right-3 top-3  shadow-black"  />
  </div>
)

})}


{selectedTab==="reel"&&userReels.map((post)=>{
 if(post.mediaType === "video")
return (
  <div key={post._id} className="relative" >
  <video  className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "muted>
    <source src={post.media} type="video/mp4" />
    Your browser does not support the video tag.
  </video> 
  <Video className="absolute right-3 top-3 shadow-2xl" />
  </div>   
)
else
return (
  <div className="relative"  key={post._id}>
  <img className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center " src={post.media} alt="" />
  <ImageIcon className="absolute right-3 top-3  shadow-black"  />
  </div>
)
})}

{selectedTab==="saved"&&userSavedPosts.map((post)=>{
 if(post.mediaType === "video")
return (
  <div key={post._id} className="relative" >
  <video  className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center "muted>
    <source src={post.media} type="video/mp4" />
    Your browser does not support the video tag.
  </video> 
  <Video className="absolute right-3 top-3 shadow-2xl" />
  </div>   
)
else
return (
  <div className="relative"  key={post._id}>
  <img className="w-full h-[20vh] md:h-[25vh] xl:h-[40vh] object-center " src={post.media} alt="" />
  <ImageIcon className="absolute right-3 top-3  shadow-black"  />
  </div>
)
})}



</section>



    </main>
  );
};

export default UserProfile;
