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



  socket.on('typing', ({roomId,userId}) => {
    socket.to(roomId).emit('typing', userId);
    console.log("typing",roomId,userId)
  });

  socket.on('stop_typing', ({roomId,userId}) => {
    socket.to(roomId).emit('stop_typing', userId);
    console.log("stop typing",roomId,userId)
  });

}