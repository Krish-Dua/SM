import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from 'react-router-dom';
import Logout from './Logout';
import EditProfileBtn from './EditProfileBtn';
import useUserStore from '../store/user';
import ChangeModeBtn from './ChangeModeBtn';

const SettingsBtn = ({children,classname}) => {
    const user = useUserStore((state) => state.user);
  return(
 <Popover>
      <PopoverTrigger className={`${classname}`}>
        {children}
        </PopoverTrigger>
      <PopoverContent className="flex flex-col border-0 gap-0 dark:bg-gray-800 bg-white p-0 rounded-lg shadow-lg overflow-hidden">
       

<ChangeModeBtn classname="w-full block text-center px-5 py-3 text-base font-medium text-gray-800 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-150" />

   <Link
  to={`/${user.username}?tab=saved`}
  className="w-full block text-center px-5 py-3 text-base font-medium text-gray-800 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-150"
>
  Saved
</Link>

      <EditProfileBtn className="w-full block text-center px-5 py-3 text-base font-medium text-gray-800 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-150" />

      <Logout classname="w-full block text-center px-5 py-3 text-base font-medium text-red-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-150" />

      </PopoverContent>
    </Popover>
  )
}

export default SettingsBtn
