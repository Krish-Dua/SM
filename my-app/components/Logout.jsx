import React,{useState}from "react";
import useUserStore from "../store/user";

const Logout = () => {
      const [loading, setloading] = useState(false);
    
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser); 

    const handleSubmit = async () => {
        setloading(true);
        const response = await fetch("http://localhost:3000/api/auth/logout", {
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
      <button onClick={handleSubmit} className="text-white bg-black p-2">Logout</button>
    </div>
  );
};

export default Logout;
