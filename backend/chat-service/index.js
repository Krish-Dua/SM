import Conversation from "./models/conversation.model.js";

export function initChatSocket(socket,io) {
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

    socket.on("join_conversations", async (userId) => {
    try {
      const conversations = await Conversation.find({ members: userId }, "_id");
      const conversationIds = conversations.map((c) => c._id.toString());

      socket.join(conversationIds);
    } catch (error) {
      console.error("❌ Error joining conversations:", error.message);
    }
  });



  socket.on('typing', ({roomId,userId}) => {
    socket.to(roomId).emit('typing', userId);
  });

  socket.on('stop_typing', ({roomId,userId}) => {
    socket.to(roomId).emit('stop_typing', userId);
  });

}