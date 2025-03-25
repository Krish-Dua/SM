import React from "react";
import useUserStore from "../store/user";
import RightSidebar from "../components/RightSidebar";
import HomeMainContent from "../components/HomeMainContent";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  return (
    <>
      <div className="flex min-h-screen">
          <div className="flex-1">
            <HomeMainContent />
          </div>
          <div>   
            <RightSidebar />
          </div>
      </div>
    </>
  );
};

export default Home;
