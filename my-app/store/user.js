import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: {
    username: 'gg',
    email: 'suresh@gmail.com',
    role: '',
    bio:'yo yo whats up',
    name: 'suresh',
    image: 'https://i.pinimg.com/originals/4c/0f/8b/4c0f8b1a2d3e5a7d6e9f3b1a2d3e5a7d.jpg',
  },
setUser:(data=null)=>{
    set({ user:data})
}
}))



export default useUserStore