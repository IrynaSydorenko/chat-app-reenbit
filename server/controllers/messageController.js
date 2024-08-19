const Chat = require('../models/chatModel');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return res
        .status(404)
        .json({ message: 'Chat not found or access denied' });
    }

    const projectedMessages = chat.messages.map((msg) => ({
      fromSelf: msg.sender.toString() === userId.toString(),
      message: msg.message,
      createdAt: msg.createdAt,
    }));

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user._id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return res
        .status(404)
        .json({ message: 'Chat not found or access denied' });
    }

    const newMessage = { message, sender: userId, createdAt: new Date() };
    chat.messages.push(newMessage);
    chat.lastMessage = newMessage;
    chat.updatedAt = new Date();
    await chat.save();

    // Auto-response logic
    setTimeout(async () => {
      try {
        const response = await fetch('https://api.quotable.io/quotes/random');
        const data = await response.json();
        const quote = data[0]?.content || "Here's a quote for you!";

        const botMessage = {
          message: quote,
          sender: 'bot',
          createdAt: new Date(),
        };

        chat.messages.push(botMessage);
        chat.lastMessage = botMessage;
        await chat.save();

        global.chatSocket.emit('msg-recieve', {
          userId: userId,
          fromSelf: false,
          message: botMessage.message,
          createdAt: botMessage.createdAt,
        });
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    }, 3000);

    return res.status(200).json({ chat });
  } catch (error) {
    next(error);
  }
};
