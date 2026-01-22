import React from "react";
import { Link } from "react-router-dom";
import useUserStore from "../store/user";
import {
  Home,
  MonitorPlay,
  LucideCompass,
  PlusSquareIcon,
} from "lucide-react";
import CreateBtn from "./CreateBtn";
const Footer = () => {
  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Explore", url: "/explore", icon: LucideCompass },
    { title: "Create", url: "#", icon: PlusSquareIcon },
    { title: "Reels", url: "/reels", icon: MonitorPlay },
  ];
  const user = useUserStore((state) => state.user);

  return (
    <footer className="h-fit w-full sm:hidden p-1 fixed left-0 bottom-0 dark:bg-black bg-white">
      <ul className="flex items-center justify-around  font-medium">
        {items.map((item, index) => (
          <li key={index} className="mb-2 transition">
            {item.title === "Create" ? (
              <CreateBtn />
            ) : (
              <Link to={item.url} className="flex items-center p-1">
                <item.icon
                  size={28}
                  className="text-black dark:text-gray-300"
                />
              </Link>
            )}
          </li>
        ))}

        <li>
          <Link
            to={`/${user.username}`}
            className="flex items-center gap-5 px-3 py-2"
          >
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="profile"
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="hidden lg:inline text-xl font-bold">Profile</span>
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
