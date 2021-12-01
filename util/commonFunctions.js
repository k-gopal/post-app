const HTTP_CODE = require('./constants');
const jwt = require('jsonwebtoken');


let objResponse = {
    status: 'SUCCESS',
    statusCode: HTTP_CODE.SUCCESS,
    message: '',
    payload: []
}

//function to send response for eery api call
const sendResponseObject = (status = true, statusCode = HTTP_CODE.SUCCESS, payload = [], message = '') => {
    if (Array.isArray(payload) && !payload.length && !message) {
        objResponse.message = 'Data not found';
    } else if ((Array.isArray(payload)) || (typeof payload === 'object' && Object.keys(payload).length)) {
        objResponse.payload = payload;
        objResponse.message = message !== '' ? message : '';
        objResponse.statusCode = statusCode !== '' ? statusCode : 200;
        objResponse.status = status ? status : 'SUCCESS';
    } else if (payload === null) {
        objResponse.message = 'Internal server error';
        statusCode = HTTP_CODE.BAD_REQUEST;
        objResponse.statusCode = HTTP_CODE.BAD_REQUEST;
    }

    return {
        ...objResponse
    };
}

//function to provide email template for otp
const sendOTPEmailVerify = (otp) => {
    return {
        message: "<h3>Hi There,</h3>" +
            "<p>Thank you for opting our service.</p>" +
            "<h5>One Time Password(OTP):<br><h2>" +
            otp +
            "</h2><p>This OTP is valid only for next 5 minutes.</p>" +
            "<p>This is a auto-generated email. Please do not reply to this email.</p>" +
            "<p>Regards</p>" +
            "<p>Post-App</p>",
        subject: "OTP: For Email Verification"
    }
}

//function to generate random otp
const generateOtp = (length, digits, upperCaseAlphabets, lowerCaseAlphabets, specialChars) => {
    const otpGenerator = require('otp-generator');
    return otpGenerator.generate(length, { digits, upperCaseAlphabets, lowerCaseAlphabets, specialChars });
}

//function to determine expiry time for otp
const getExpiryTime = (date, minutes) => {
    return new Date(date.getTime() + minutes*60000);
}

//function to compare current and expiry time for otp
const compareExpiryDate = (date) => {
    let currentDate = new Date();
    console.log("date: ", date);
    console.log("current", currentDate)
    return date >= currentDate;
}

//function to generate jwt token for verified users
const generateAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30*60 })
}

//function to comapre fetched token to authenticate user
const authAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        return false
    }
}

module.exports = {
    sendResponseObject,
    generateOtp,
    sendOTPEmailVerify,
    getExpiryTime,
    compareExpiryDate,
    generateAccessToken,
    authAccessToken
};
