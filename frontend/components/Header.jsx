import React from 'react'
import {Heart,MessageCircle} from 'lucide-react'
import { Link } from 'react-router-dom'
import NotificationBtn from './NotificationBtn';
import logo from "../src/assets/logo.png"
import { useChatStore } from '../store/chat';

const Header = () => {
    const items = [
        { title: "Notifications", url: "/notifications", icon: Heart },
        { title: "Messages", url: "/chat", icon: MessageCircle },
      ];
  return (
    <header className='h-fit w-full sm:hidden p-2 fixed left-0 top-0 border-b-2 border-slate-800 dark:text-white dark:bg-black bg-white'>
<main className='mt-2 flex items-center justify-between px-2'>
  <Link to="/" >
    <div className="flex items-center justify-around" >
              <img className="dark:invert h-12 w-12" src={logo} alt="" />
    </div></Link>
    <ul className="flex items-center gap-6 justify-around  font-medium">
               {items.map((item, index) => (
                 <li
                 key={index}                     
                   className="transition"
                 >
                  {item.title==="Notifications"?(<NotificationBtn/>):(
                   <Link
                     to={item.url}
                     className="flex items-center p-1"
                   >  
                     <div className="relative">
                       <item.icon
                         size={26}
                         className="text-black dark:text-gray-300"
                       />
                       {item.title === 'Messages' && <MessageUnreadBadgeInline />}
                     </div>
                    </Link>)}
                 </li>
               ))}
             </ul>
</main>
    </header>
  )
}

export default Header

function MessageUnreadBadgeInline() {
  const conversations = useChatStore((state) => state.conversations);
  const total = (conversations || []).reduce((s, c) => s + (c.unreadCount || 0), 0);
  if (total === 0) return null;
  return (
    <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-bold transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
      {total}
    </span>
  );
}
