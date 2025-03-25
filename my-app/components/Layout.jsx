import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <div>
        <LeftSidebar />
      </div>

      {/* Main Content - Changes Based on Route */}
      <div className="flex-1 min-h-screen md:p-2 w-full bg-white dark:bg-black dark:text-white">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;
