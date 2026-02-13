import express from "express";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io } from "../../index.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";
const router = express.Router();

router.post("/conversation", authenticateUser, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.user.userId;

    if (receiverId === userId.toString()) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [userId, receiverId],
      });
    }
  let popConvo=await conversation.populate("members", "username name avatar");
    res.status(200).json({ success: true, data: popConvo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/conversations", authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    const conversations = await Conversation.find({ members: userId ,lastMsg: { $exists: true }})
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .populate("members", "username name avatar");

    // compute unreadCount per conversation for current user
    const convoWithUnread = await Promise.all(conversations.map(async (convo) => {
      const unreadCount = await Message.countDocuments({ conversationId: convo._id, readBy: { $ne: userId } });
      return { ...convo.toObject(), unreadCount };
    }));

    res.status(200).json({ success: true, data: convoWithUnread });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/messages/:conversationId", authenticateUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("sender", "avatar");

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/messages", authenticateUser, async (req, res) => {
  try {
    const { conversationId, msg } = req.body;
    const senderId = req.user.userId;

    const message = await Message.create({
      conversationId,
      sender: senderId,
      msg,
      readBy: [senderId],
    });
    const popMsg = await message.populate("sender", "avatar username");

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMsg: msg,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("members", "_id");

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    const receiver = conversation.members.find(
      (m) => m._id.toString() !== senderId.toString()
    );


    if (receiver) {
      io.to(receiver._id.toString()).emit("receive_message", popMsg);
    }

    // emit for sender as well so clients can update unread/preview immediately
    io.to(senderId.toString()).emit("receive_message", popMsg);

    res.status(200).json({ success: true, data: popMsg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// mark all messages in a conversation as read by current user
router.post('/conversations/:conversationId/read', authenticateUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const result = await Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    // notify the other participant that messages were read
    const conversation = await Conversation.findById(conversationId).populate('members', '_id');
    if (conversation) {
      const other = conversation.members.find((m) => m._id.toString() !== userId.toString());
      if (other) {
        io.to(other._id.toString()).emit('messages_read', { conversationId, readerId: userId });
      }
    }

    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
