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


const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Explore", url: "/explore", icon: LucideCompass },
  { title: "Reels", url: "/reels", icon: MonitorPlay },
  { title: "Messages", url: "#", icon: MessageCircleCode },
  { title: "Notifications", url: "/notifications", icon: Heart },
];

function AppSidebar() {
  const user = useUserStore((state) => state.user);
  const location=useLocation();
const isChatPage=location.pathname.startsWith("/explore");
  return (
    <>
      <aside
        className={`hidden sm:flex border-r border-slate-700 h-screen z-10 sticky top-0 bg-white dark:bg-black text-gray-800 dark:text-gray-200 ${
        isChatPage ? "w-fit" : "w-fit lg:w-58 xl:w-64"
      }`}
        aria-label="Sidebar"
      >
        <div className="h-full w-full px-3 py-4 overflow-y-auto">
          <div className="text-2xl flex justify-start md:justify-center text-black font-bold dark:text-gray-300 mb-6">
            E-CONN
          </div>

          <ul className="space-y-2 font-medium">
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
                  <item.icon
                    size={30}
                    className="text-gray-700 dark:text-gray-400"
                  />
                { !isChatPage&& <sp an className={`hidden lg:inline text-xl font-bold`}>
                    {item.title}
                  </sp>}
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
                      className="w-8 h-8 object-cover rounded-full"
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
