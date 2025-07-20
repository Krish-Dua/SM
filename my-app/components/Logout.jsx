import React,{useState}from "react";
import useUserStore from "../store/user";

const Logout = ({classname}) => {
      const [loading, setloading] = useState(false);
    
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser); 

    const handleSubmit = async () => {
        setloading(true);
        const response = await fetch("http://localhost:3000/api/user/logout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
      setUser()
        
    
        setloading(false);
    }

  return (
    <div>
      <button onClick={handleSubmit} className={`${classname}`}>Logout</button>
    </div>
  );
};

export default Logout;
