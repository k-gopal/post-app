const User = require('../models/Users');
const HTTP_CODE = require('../util/constants');
const { authAccessToken, sendResponseObject } = require('../util/commonFunctions');

//function to validate whether the requested API call is from registered and verified user
const authenticate = async (req, res, next) => {
    let token = req.headers["authorization"];

    let email = authAccessToken(token);
    console.log("email", email)
    if (email?.user) {
        let user = await User.findOne({ email: email.user });
        console.log("user", user)
        if (user._id) {
            req.user = email.user;
            next()
        } else {
            res.send(sendResponseObject("FAILURE", HTTP_CODE.UNAUTHORISED, [], "Invalid Token."))
        }
    } else {
        res.send(sendResponseObject("FAILURE", HTTP_CODE.UNAUTHORISED, [], "Invalid Token."))
    }
}

module.exports = {
    authenticate
}