const User = require('../models/usersModel');
const express = require('express');
const authController = require('../controllers/authController')

const router = express.Router();




router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// router.get('/forgetPassword')
// router.get('/resetPassword')
module.exports = router