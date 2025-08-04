import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import { ToastContainer } from 'react-toastify';


const Layout = () => {

  return (
    <div className="flex min-h-screen">
<ToastContainer 
position="top-center"
autoClose={4000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
pauseOnHover
theme="dark"
/>
      <div>
        <LeftSidebar />
      </div>

      

      {/* Main Content - Changes Based on Route */}
      <div className="flex-1 min-h-[100dvh]  w-full bg-white dark:bg-black dark:text-white">
        <Outlet /> 
      </div>

{/* footer  */}
      <Footer/>
      
    </div>
  );
};

export default Layout;
