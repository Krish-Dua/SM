import React from 'react'
import useUserStore from '../store/user';
const FollowUnfollwBtn = ({targetUserId,classname,setTargetUser,targetUser}) => {
    const userStore = useUserStore((state) => state.user);
    const setUserStore = useUserStore((state) => state.setUser);

const handleFollowUnfollow = async () => {
    const response = await fetch(`http://localhost:3000/api/user/fuf/${targetUserId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) {
        alert(data.message);
        return;
    }
    if (data.success) {
        if (data.message === "Unfollowed user") {
            if (setTargetUser) {
                setTargetUser({ ...targetUser, followers: targetUser.followers.filter(id => id.toString() !== userStore._id) });
            }
            setUserStore({ ...userStore, following: userStore.following.filter(id => id.toString() !== targetUserId) });
        } else if (data.message === "Followed user") {
            if (setTargetUser) {
                setTargetUser({ ...targetUser, followers: [...targetUser.followers, userStore._id] });
            }
            setUserStore({ ...userStore, following: [...userStore.following, targetUserId] });
        }
    }
}
  return (
    <button onClick={handleFollowUnfollow} className={`${classname}  `} >
      {userStore.following.includes(targetUserId) ? "Unfollow" : "Follow"}
    </button>
  )
}

export default FollowUnfollwBtn
