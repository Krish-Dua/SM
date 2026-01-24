import { create } from 'zustand';
import useUserStore from './user';

export const useChatStore = create((set, get) => ({
  activeConversation: null,
  conversations: [],
  messages: [],
  loadingConversations: false,
  loadingMessages: false,
  sendingMessage: false,
  hasMoreConversations: true,
  hasMoreMessages: true,
  typingUsers: [],
  onlineUsers:[],
  setOnlineUsers:(users)=>set({onlineUsers:users}),

  setActiveConversation: (convo) =>
    set({ activeConversation: convo, messages: [], hasMoreMessages: true }),

  clearActiveConversation: () =>
    set({ activeConversation: null, messages: [], hasMoreMessages: true }),

  fetchConversations: async (page = 1,limit=5) => {
    try {
      set({ loadingConversations: true });
      const res = await fetch(`/api/chat/conversations?page=${page}&limit=${limit}`, {
        method:"GET",
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) {
        return
      }
const loggedInUserId = useUserStore.getState().user?._id;
const formattedConversations = data.data.map(convo => {
  const receiver = convo.members.find(user => user._id !== loggedInUserId);
  return {
    _id: convo._id,
    receiver,
    lastMsg: convo.lastMsg || null,
    updatedAt: convo.updatedAt
  };
});
      set((state) => ({
        conversations:
          page === 1 ? formattedConversations : [...state.conversations, ...formattedConversations],
        hasMoreConversations: formattedConversations.length === limit,
        loadingConversations: false,
      }));
    } catch (error) {
      console.error(error);
      set({ loadingConversations: false });
    }
  },

  fetchMessages: async (conversationId, page = 1,limit=20) => {
    try {
      set({ loadingMessages: true });
      const res = await fetch(`/api/chat/messages/${conversationId}?page=${page}&limit=${limit}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      set((state) => ({
        messages:
          page === 1 ? data.data : [ ...state.messages,...data.data],
        hasMoreMessages: data.data.length === limit,
        loadingMessages: false,
      }));
    } catch (error) {
      console.error(error);
      set({ loadingMessages: false });
    }
  },

  sendMessage: async (conversationId, msg) => {
    try {
      set({ sendingMessage: true });
      const res = await fetch(`/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ conversationId, msg }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      set((state) => ({
        messages: [data.data,...state.messages],
        sendingMessage: false,

      }));

    } catch (error) {
      console.error(error);
      set({ sendingMessage: false });
    }
  },

  addMessage: (message) =>{
    set((state) => ({
      messages: [message,...state.messages],
    }))},

  updateConversation: (conversation) =>
    set((state) => {
      const filtered = state.conversations.filter((c) => c._id !== conversation._id);
      return { conversations: [conversation, ...filtered] };
    }),

  setTyping: (userId, isTyping) =>
    set((state) => {
      const typingUsers = isTyping
        ? [...state.typingUsers, userId]
        : state.typingUsers.filter((id) => id !== userId);
      return { typingUsers };
    
    }),

  resetChatState: () =>
    set({
      onlineUsers:[],
      activeConversation: null,
      conversations: [],
      messages: [],
      hasMoreConversations: true,
      hasMoreMessages: true,
      typingUsers: [],
    }),
}));
