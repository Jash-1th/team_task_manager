const express = require('express');
const router = express.Router();
const { signup, login, getMe, getAllUsers } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, getAllUsers);

module.exports = router;
