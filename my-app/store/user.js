import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: {
    username: 'gg',
    email: '',
    role: '',
  },
setUser:(data=null)=>{
    set({ user:data})
}
}))



export default useUserStore