import React, { useEffect } from "react";
import useNotificationStore from "../store/notification";
import { Link, useNavigate } from "react-router-dom";
import usePostStore from "../store/posts";
import FollowUnfollwBtn from "../components/FollowUnfollwBtn";
import {formatTime}from"../src/lib/dayjs"
import { Dot } from "lucide-react";
const Notifications = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const setPostPageArray=usePostStore((state)=>state.setPostPageArray)
  const Navigate = useNavigate();


const markAsRead=async()=>{
  const response = await fetch(`/api/notification/mark-all-read`,{
    method:"PATCH",
    credentials:"include",
    headers: { "Content-Type": "application/json" }
  })
  const data=await response.json()
if(data.success){
  markAllRead()
}
}

useEffect(()=>{
  markAsRead()
},[])

  return (
    <main className="max-w-2xl  h-max mx-auto py-4 sm:px-4 mb-12 ">
      <h1 className="text-center font-bold mb-6  text-2xl">Notifications</h1>

      <div className="shadowed-md rounded-lg p-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className=" p-1 mb-1 flex items-center justify-between last:mb-0  rounded-lg "
          >
            {n.type === "follow" && (
              <>
                <Link to={`/${n.sender.username}`}>
                  <div className="">
                    <div>
                      <div className="flex w-full items-center gap-4 sm:gap-6">
                        <div className="h-13  w-13 rounded-full overflow-hidden bg-slate-200">
                          <img
                            src={n.sender.avatar || "/default-avatar.png"}
                            alt={n.sender.name}
                            className="h-full w-full object-center"
                          />
                        </div>
                        <p className="text-md flex items-center gap-1 sm:gap-3 font-medium flex-wrap sm:max-w-full max-w-[65%] dark:text-white text-black">
                          <span className="">{n.sender.username}</span>{" "}
                          <span>started following you</span>
                          <span className="text-xs text-gray-400" >{formatTime(n.createdAt)}</span>

                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <FollowUnfollwBtn classname={"bg-blue-600 w-13 text-xs p-1 rounded-sm text-white"} targetUserId={n.sender._id} />
              </>
            )}  
            {n.type === "like" && (
              <>
                <main className="cursor-pointer" onClick={() => {
                  Navigate(`/p/${n.post._id}`);
                  setPostPageArray()
                }} >
                  <div className="">
                    <div>
                      <div className="flex w-full items-center gap-4 sm:gap-6">
                        <div className="h-13  w-13 rounded-full overflow-hidden bg-slate-200">
                          <img
                            src={n.sender.avatar || "/default-avatar.png"}
                            alt={n.sender.name}
                            className="h-full w-full object-center"
                          />
                        </div>
                        <p className="text-md flex items-center gap-1 sm:gap-3 font-medium flex-wrap sm:max-w-full max-w-[65%] dark:text-white text-black">
                          <span className="">{n.sender.username}</span>
                          <span>{`liked your ${n.post.postType}`}</span>
                          <span className="text-xs text-gray-400" >{formatTime(n.createdAt)}</span>

                        </p>
                      </div>
                    </div>
                  </div>
                </main>
                <div className="h-12  w-12 rounded-sm overflow-hidden bg-slate-200">
                  {n.post.mediaType === "video" ? (
                     <video
                      className="w-full h-full object-cover "
                      muted
                    >
                      <source src={n.post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={n.post.media}
                      alt={n.sender.name}
                      className="h-full w-full object-center"
                    />
                  )}
                </div>
              </>
            )}


            {n.type === "comment" && (
              <>
                <main className="cursor-pointer" onClick={() => {
                  Navigate(`/p/${n.post._id}`);
                  setPostPageArray()
                }} >
                  <div className="">
                    <div>
                      <div className="flex w-full items-center gap-4 sm:gap-6">
                        <div className="h-13  w-13 rounded-full overflow-hidden bg-slate-200">
                          <img
                            src={n.sender.avatar || "/default-avatar.png"}
                            alt={n.sender.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-md flex items-center gap-1 sm:gap-3 flex-wrap sm:max-w-full max-w-[65%] font-medium dark:text-white text-black">
                          <span className="">{n.sender.username}</span>{" "}
                          <span>{`commented your ${n.post.postType}`}</span>
                          <span className="text-xs text-gray-400" >{formatTime(n.createdAt)}</span>

                        </p>
                      </div>
                    </div>
                  </div>
                </main>
                <div className="h-12  w-12 rounded-sm overflow-hidden bg-slate-200">
                  {n.post.mediaType === "video" ? (
                     <video
                      className="w-full h-full object-cover "
                      muted
                    >
                      <source src={n.post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={n.post.media}
                      alt={n.sender.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Notifications;
