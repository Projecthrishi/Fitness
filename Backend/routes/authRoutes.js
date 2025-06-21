const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();
const { getUser } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/user', verifyToken, getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
