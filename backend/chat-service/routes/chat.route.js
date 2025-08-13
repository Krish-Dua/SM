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
    console.log(error);
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
      .limit(Number(limit))
      .populate("members", "username name avatar");

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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

    res.status(200).json({ success: true, data: popMsg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
