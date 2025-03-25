import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: {
    name: '',
    email: '',
    role: '',
  },
setUser:(data=null)=>{
    set({ user:data})
}
}))



export default useUserStore