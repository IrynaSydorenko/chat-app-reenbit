const Chat = require('../models/chatModel');

module.exports.createChat = async (req, res, next) => {
  try {
    const { firstName, lastName, avatarImage } = req.body;
    const userId = req.user._id;
    const title = `${firstName} ${lastName}`;

    const newChat = await Chat.create({
      title,
      firstName,
      lastName,
      avatarImage,
      messages: [],
      user: userId,
    });

    return res.json(newChat);
  } catch (error) {
    next(error);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { chatId, message, sender } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = { message, sender, createdAt: new Date() };
    chat.messages.push(newMessage);
    chat.lastMessage = newMessage;
    chat.updatedAt = new Date();
    await chat.save();

    return res.status(200).json({ chat });
  } catch (error) {
    next(error);
  }
};

module.exports.getChats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ user: userId });

    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete chat', error });
  }
};

module.exports.updateChatName = async (req, res, next) => {
  try {
    const { chatId, firstName, lastName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { title: `${firstName} ${lastName}`, firstName, lastName },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.status(200).json(updatedChat);
  } catch (error) {
    next(error);
  }
};
