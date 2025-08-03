import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMsg: { type: String },
}, { timestamps: true });

const Conversation=mongoose.model('Conversation', conversationSchema);

export default Conversation;