const { addMessage, getMessages } = require('../controllers/messageController');

const router = require('express').Router();
const { authenticateUser } = require('../middlewares/auth');

router.post('/addmsg/', authenticateUser, addMessage);
router.post('/getmsg/', authenticateUser, getMessages);

module.exports = router;
