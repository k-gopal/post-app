const express = require('express');
const router = express.Router();
const { signUpFunc, signInFunc, verifyOTPFunc, userDetailsFunc } = require('../controllers/auth');
const { authenticate } = require('../services/authenticate');

// signup using email with OTP
router.post('/signUp', signUpFunc);

// verify otp with email
router.post('/verifyOtp', verifyOTPFunc);

// sign in using email with OTP
router.post('/signIn', signInFunc);

//update first and last name
router.post('/userDetails',authenticate, userDetailsFunc)

module.exports = router;