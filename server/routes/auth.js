const {
  login,
  register,
  getUser,
  setAvatar,
  logOut,
} = require('../controllers/userController');

const router = require('express').Router();
const { authenticateUser } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/user/:id', authenticateUser, getUser);
router.post('/setavatar/:id', authenticateUser, setAvatar);
router.post('/logout', authenticateUser, logOut);

module.exports = router;
