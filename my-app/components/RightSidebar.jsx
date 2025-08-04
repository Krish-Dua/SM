import React from 'react';
import { Link } from 'react-router-dom';
import FollowUnfollwBtn from './FollowUnfollwBtn';

 function RightSidebar({suggestedUsers}) {

  return (
    <aside className="hidden xl:flex w-80  p-4">
      <div className="w-full">
        <div className='flex justify-around' >
        <h2 className="text-md font-semibold mb-4">Suggested for you</h2>
<Link className='text-blue-600' to={"/suggestions"} >
See All
</Link>
        </div>
        <div className="shadow-md rounded-lg p-3">
          {suggestedUsers.map((user) => (

            <div key={user.username} className="mb-3 p-2 flex items-center justify-between last:mb-0  rounded-lg">
             <Link to={user.username} >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white text-black">{user.username}</p>
                  <p className="text-xs text-gray-300">{user.name}</p>
                </div>
              </div>
</Link>

<FollowUnfollwBtn targetUserId={user._id} classname={"text-xs px-3 py-1 border  border-gray-300 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"} />
            
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
export default RightSidebar;