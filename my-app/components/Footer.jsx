import React from 'react'
import { Link } from 'react-router-dom';

import {
    Home,
    MonitorPlay,
    LucideCompass,
    Settings,
    PlusSquareIcon,
    
  } from "lucide-react";    
const Footer = () => {
    const items = [
        { title: "Home", url: "/", icon: Home },
        { title: "Explore", url: "#", icon: LucideCompass },
        { title: "Create", url: "#", icon: PlusSquareIcon },
        { title: "Reels", url: "#", icon: MonitorPlay },
        { title: "Create", url: "#", icon: Settings },
      ];
      

  return (
    
    <footer className='h-fit w-full sm:hidden p-1 fixed left-0 bottom-0 dark:bg-black bg-white'>
  <ul className="flex items-center justify-around  font-medium">
            {items.map((item, index) => (
              <li
              key={index}                     
                className="mb-2 transition"
              >
                <Link
                  to={item.url}
                  className="flex items-center p-1"
                >  
                  <item.icon
                    size={28}
                    className="text-black dark:text-gray-300"
                  />
                </Link>
              </li>
            ))}
          </ul>
    </footer>
  )
}

export default Footer
