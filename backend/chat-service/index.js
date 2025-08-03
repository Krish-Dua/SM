import Conversation from "./models/conversation.model.js";

export function initChatSocket(socket,io) {
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

    socket.on("join_conversations", async (userId) => {
    try {
      const conversations = await Conversation.find({ members: userId }, "_id");
      const conversationIds = conversations.map((c) => c._id.toString());

      socket.join(conversationIds);
      console.log(`✅ User ${userId} joined rooms:`, conversationIds);
    } catch (error) {
      console.error("❌ Error joining conversations:", error.message);
    }
  });



  socket.on('typing', (conversationId) => {
    socket.to(conversationId).emit('typing', socket.id);
  });

  socket.on('stop_typing', (conversationId) => {
    socket.to(conversationId).emit('stop_typing', socket.id);
  });

}