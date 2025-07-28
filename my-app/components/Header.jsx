import React from 'react'
import {Heart,MessageCircle} from 'lucide-react'
import { Link } from 'react-router-dom'
import NotificationBtn from './NotificationBtn';

const Header = () => {
    const items = [
        { title: "Notifications", url: "/notifications", icon: Heart },
        { title: "Messages", url: "#", icon: MessageCircle },
      ];
  return (
    <header className='h-fit w-full sm:hidden p-2 fixed left-0 top-0 dark:text-white dark:bg-black bg-white'>
<main className='mt-2 flex items-center justify-between px-2'>
    <section className='text-2xl font-bold'>E-conn</section>
    <ul className="flex items-center gap-6 justify-around  font-medium">
               {items.map((item, index) => (
                 <li
                 key={index}                     
                   className="transition"
                 >
                  {items.title==="Notifications"?(<NotificationBtn/>):(
                   <Link
                     to={item.url}
                     className="flex items-center p-1"
                   >  
                     <item.icon
                       size={26}
                       className="text-black dark:text-gray-300"
                     />
                   </Link>)
}
                 </li>
               ))}
             </ul>
</main>
    </header>
  )
}

export default Header
