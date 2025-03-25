import React from 'react'
import Signup from '../components/signup'
import Login from '../components/Login'
const Authpage = () => {
const [login,setlogin]=React.useState(true)
  return (
    <div>
      {login?<Login setlogin={setlogin}/>:<Signup setlogin={setlogin} />}
    </div>
  )
}

export default Authpage

