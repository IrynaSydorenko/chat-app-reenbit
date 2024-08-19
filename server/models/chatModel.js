const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatarImage: { type: String, default: '' },
  messages: [MessageSchema],
  lastMessage: MessageSchema,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Chat', ChatSchema);
