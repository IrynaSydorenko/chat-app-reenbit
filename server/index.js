const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const chatRoutes = require('./routes/chat');
const app = express();
const socket = require('socket.io');
require('dotenv').config();

app.use(
  cors({
    origin: process.env.CLIENT_APP_URL || 'http://localhost:3000',
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });
});
