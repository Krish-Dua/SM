import React from 'react';
import { Link } from 'react-router-dom';
import FollowUnfollwBtn from './FollowUnfollwBtn';

 function RightSidebar({suggestedUsers}) {

  return (
    <aside className="hidden xl:flex w-80 p-4 bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="w-full">
        <div className='flex justify-around'>
          <h2 className="text-md font-semibold mb-4 text-black dark:text-white">Suggested for you</h2>
          <Link className='text-blue-600 dark:text-blue-400 hover:underline' to={"/suggestions"}>
            See All
          </Link>
        </div>
        <div className="shadow-md rounded-lg p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="mb-3 p-2 flex items-center justify-between last:mb-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
             <Link to={user.username} >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img 
                    src={user.avatar || "/default-avatar.png"} 
                    alt={user.name} 
                    className="h-full w-full object-center" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user.name}</p>
                </div>
              </div>
</Link>

                <FollowUnfollwBtn targetUserId={user._id} classname={"text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition"} />
            
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
export default RightSidebar;