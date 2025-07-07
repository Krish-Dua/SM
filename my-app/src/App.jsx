import './App.css'
import React,{useState,useEffect} from 'react'
import {Route,Routes} from 'react-router-dom'
import Authpage from '../pages/Authpage'
import Home from '../pages/Home'
import UserProfile from '../pages/UserProfile'
import useUserStore from '../store/user'
import { Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Explore from '../pages/Explore'

function App() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setloading] = useState(false);


  useEffect( () => {
  console.log(user)
    setloading(true);
    const fetchUser=async ()=>{
      const response = await fetch("http://localhost:3000/api/user/me", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(!data.success) {
//
      }
      else{
        console.log(data);
        setUser(data.data);
      }
      setloading(false);
    }
    fetchUser();
  }, [])
  

  return (
  <>
    <Routes>
        {/* Protected Routes with Sidebar */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/auth" />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path=':username' element={<UserProfile/>}/>
          {/* <Route path="suggestions" element={<Suggestions />} /> */}
        </Route>

        {/* Auth Route (Without Sidebar) */}
        <Route path="/auth" element={!user ? <Authpage /> : <Navigate to="/" />} />
      </Routes>
  </>
  )
}

export default App
