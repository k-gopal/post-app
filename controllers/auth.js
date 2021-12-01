const nodemailer = require('nodemailer');
const HTTP_CODE = require('../util/constants');
const { sendResponseObject, generateOtp, sendOTPEmailVerify, generateAccessToken } = require('../util/commonFunctions');
const { connect } = require('../database/database');
const emailVerificationSchema = require('../schemas/emailVerificationSchema');
const verifyOtpSchema = require('../schemas/verifyOtpSchema');
const { saveEmailAndOtp, saveOtp, verifyOtp, checkUser, updateOtp, updateUserDetails } = require('../services/userService');
const signUpSchema = require('../schemas/signUpSchema');

//db connection
if (typeof client === "undefined") var client = connect();

// function to signup user and send otp on email
const signUpFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = emailVerificationSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to generate OTP. Bad request."));
        }

        let checkUserResult = await checkUser(body.email);

        if (!checkUserResult) {
            const otp = generateOtp(6, true, false, false, false);
            console.log("otp: ", otp);
            const { message, subject } = sendOTPEmailVerify(otp);

            let saveOtpResult = await saveOtp(otp);

            if (saveOtpResult) {
                let saveEmailAndOtpResult = await saveEmailAndOtp(body.email, saveOtpResult._id);

                if (saveEmailAndOtpResult) {
                    // Create nodemailer transporter
                    const nodemailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: `${process.env.EMAIL_ADDRESS}`,
                            pass: `${process.env.EMAIL_PASSWORD}`
                        },
                    });

                    const sendMailOptions = {
                        from: process.env.EMAIL_ADDRESS,
                        to: body.email,
                        subject,
                        html: message,
                    };

                    console.log("Mail option: ", sendMailOptions);
                    await nodemailTransporter.verify();

                    //Send Email
                    await nodemailTransporter.sendMail(sendMailOptions, (err, response) => {
                        if (err) {
                            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [err], "Not able to generate OTP."));
                        } else {
                            let resp = {
                                email: body.email
                            }
                            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [resp], "OTP sent successfully."));
                        }
                    });
                } else {
                    return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to generate OTP."));
                }
            } else {
                return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to generate OTP."));
            }
        } else {
            //TODO: what if email is inserted and user is not verified
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [], "User Already Exist."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to generate OTP."));
    }
}

//function to verify otp sent while signup or signin
const verifyOTPFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = verifyOtpSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to verify OTP, please try again. Bad request."));
        }

        let verifyOtpResult = await verifyOtp(body.email, body.otp);
        console.log("verifyOtpResult", verifyOtpResult)

        if (verifyOtpResult) {
            let token = generateAccessToken(body.email);
            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [{ token }], "OTP verified."));
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [], "Could not verify OTP(incorrect/expiry)."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to verify OTP, please try again."));
    }
}

//function to signin and send otp on email 
const signInFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = emailVerificationSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to generate OTP, please try again. Bad request."));
        }

        let checkUserResult = await checkUser(body.email);

        if (checkUserResult) {
            const otp = generateOtp(6, true, false, false, false);
            console.log("otp: ", otp);
            const { message, subject } = sendOTPEmailVerify(otp);

            let updateOtpResult = await updateOtp(checkUserResult.otpId, otp);

            if (updateOtpResult) {
                    // Create nodemailer transporter
                    const nodemailTransporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: `${process.env.EMAIL_ADDRESS}`,
                            pass: `${process.env.EMAIL_PASSWORD}`
                        },
                    });

                    const sendMailOptions = {
                        from: process.env.EMAIL_ADDRESS,
                        to: body.email,
                        subject,
                        html: message,
                    };

                    console.log("Mail option: ", sendMailOptions);
                    await nodemailTransporter.verify();

                    //Send Email
                    await nodemailTransporter.sendMail(sendMailOptions, (err, response) => {
                        if (err) {
                            return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [err], "Not able to generate OTP."));
                        } else {
                            let resp = {
                                email: body.email
                            }
                            return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [resp], "OTP sent successfully."));
                        }
                    });
                } else {
                    return res.send(sendResponseObject("FAILURE", HTTP_CODE.FAILURE, [], "Not able to generate OTP."));
                }
        } else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [error], "User is not registered, please sign up."));
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [error], "Not able to generate OTP, please try again."));
    }
}

//function to update user details after otp verification
const userDetailsFunc = async (req, res, next) => {
    try {
        console.log("Body: ", req.body);
        let body = req.body;
        let validation = signUpSchema.validate(body);

        if (validation.error) {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.BAD_REQUEST, [validation.error], "Not able to generate OTP, please try again. Bad request."));
        }

        if(req.user){
            let updateUserDetailsResult = await updateUserDetails(req.user, req.body.firstName, req.body.lastName);
            if(updateUserDetailsResult){
                return res.send(sendResponseObject("SUCCESS", HTTP_CODE.SUCCESS, [{
                    body
                }], "User details updated successfully."));
            }else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.INTERNAL_SERVER_ERROR, [], "Can no update user details."));
            }
        }else {
            return res.send(sendResponseObject("FAILURE", HTTP_CODE.UNAUTHORISED, [], "Email is not present."));
        }
    } catch (error) {
        
    }
}

//exporting the above functions
module.exports = {
    signUpFunc,
    verifyOTPFunc,
    signInFunc,
    userDetailsFunc
}