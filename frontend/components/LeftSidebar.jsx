import {
  Calendar,
  Home,
  LucideCompass,
  MonitorPlay,
  Settings,
  MessageCircleCode,
  Heart,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import CreateBtn from "./CreateBtn";
import useUserStore from "../store/user";
import SettingsBtn from "./SettingsBtn";
import NotificationBtn from "./NotificationBtn";
import { useChatStore } from '../store/chat';
import logo from "../src/assets/logo.png"

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Explore", url: "/explore", icon: LucideCompass },
  { title: "Reels", url: "/reels", icon: MonitorPlay },
  { title: "Messages", url: "/chat", icon: MessageCircleCode },
  { title: "Notifications", url: "/notifications", icon: Heart },
];

function AppSidebar() {
  const user = useUserStore((state) => state.user);
  const location=useLocation();
const isChatPage=location.pathname.startsWith("/chat");
  return (
    <>
      <aside
        className={`hidden sm:flex border-r border-slate-700 h-screen z-10 sticky top-0 bg-white dark:bg-black text-gray-800 dark:text-gray-200 ${
        isChatPage ? "w-fit" : "w-fit lg:w-58 xl:w-64"
      }`}
        aria-label="Sidebar"
      >
        
        <div className="h-full w-full px-3 py-4 overflow-y-auto">
          <Link to="/" >
          <div className="flex items-center justify-around" >
          <img className="dark:invert h-12 w-12" src={logo} alt="" />
          {!isChatPage&&<div className="text-xl text-black font-bold dark:text-gray-300 hidden lg:inline">
            CONNECTICX
          </div>}
</div></Link>
          <ul className="space-y-2 mt-5 font-medium">
            {items.map((item, index) => (
              <li
              key={index}                     
                className=" hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl mb-3 transition"
              >
{item.title==="Notifications" ?(<NotificationBtn isCompact={isChatPage} />):(
                <Link
                  to={item.url}
                  className="flex items-center  gap-5 px-3 py-2"
                >  
                  <div className="relative">
                    <item.icon
                      size={30}
                      className="text-gray-700 dark:text-gray-400"
                    />
                    {item.title === 'Messages' && <MessageBadgeSidebar />}
                  </div>
                { !isChatPage&& <span className={`hidden lg:inline text-xl font-bold`}>
                    {item.title}
                  </span>}
                </Link>
)
}
              </li>
            ))}
            
               <li                   
                className=" hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl mb-3 transition"
              >
               <CreateBtn isCompact={isChatPage} />
              </li>

<li className=" hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl mb-3 transition">
<SettingsBtn>
   <div className="flex items-center cursor-pointer  gap-5 px-3 py-2">
          <Settings
            size={26}
            className="text-gray-700 dark:text-gray-400"
          />
         {!isChatPage&& <span className="hidden lg:inline text-xl font-bold">Settings</span>}
        </div>
  </SettingsBtn>
</li>


                <li className=" hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl mb-3 transition">
                  <Link 
                    to={`/${user.username}`}
                    className="flex items-center gap-5 px-3 py-2"
                  >
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="profile"
                      className="w-8 h-8 object-center rounded-full"
                    />
                  {!isChatPage && <span className="hidden lg:inline text-xl font-bold">
                      Profile
                    </span>}
                  </Link>
                </li>




          </ul>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;

function MessageBadgeSidebar() {
  const conversations = useChatStore((state) => state.conversations);
  const total = (conversations || []).reduce((s, c) => s + (c.unreadCount || 0), 0);
  if (total === 0) return null;
  return (
    <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-bold transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
      {total}
    </span>
  );
}
