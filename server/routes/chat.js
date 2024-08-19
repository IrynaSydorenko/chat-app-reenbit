const {
  createChat,
  addMessage,
  getChats,
  deleteChat,
  updateChatName,
} = require('../controllers/chatController');

const router = require('express').Router();
const { authenticateUser } = require('../middlewares/auth');

router.post('/create', authenticateUser, createChat);
router.post('/addMessage', authenticateUser, addMessage);
router.get('/all', authenticateUser, getChats);
router.delete('/delete/:id', authenticateUser, deleteChat);
router.put('/update', authenticateUser, updateChatName);

module.exports = router;
