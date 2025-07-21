import { create } from 'zustand';

const usePostStore = create((set) => ({
  feedPosts: [],
  explorePosts: [],
  postPageArray: [],
  homeSuggestedUsers:[],

  setFeedPosts: (posts) => set({ feedPosts: posts }),
  setExplorePosts: (posts) => set({ explorePosts: posts }),
  setPostPageArray: (posts=[]) => set({ postPageArray: posts }),
  setHomeSuggestedUsers:(users)=>set({homeSuggestedUsers:users})
}));

export default usePostStore