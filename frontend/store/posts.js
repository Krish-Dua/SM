import { create } from 'zustand';

const usePostStore = create((set) => ({
  feedPosts: [],
  explorePosts: [],
  postPageArray: [],
  homeSuggestedUsers:[],

  setFeedPosts: (posts) => set({ feedPosts: posts }),
  setExplorePosts: (posts) => set({ explorePosts: posts }),
  setPostPageArray: (posts=[]) => set({ postPageArray: posts }),
  setHomeSuggestedUsers:(users)=>set({homeSuggestedUsers:users}),
  updateExplorePostLikes: (postId, newLikes) =>
    set((state) => {
      const post = state.explorePosts.find((p) => p._id === postId);
      if (post) {
        post.likes = newLikes; 
      }
      return { explorePosts: state.explorePosts }; 
    }),
    updateFeedPostLikes: (postId, newLikes) =>
  set((state) => {
    const post = state.feedPosts.find((p) => p._id === postId);
    if (post) {
      post.likes = newLikes; 
    }
    return { feedPosts: state.feedPosts }; 
  }),
}));

export default usePostStore