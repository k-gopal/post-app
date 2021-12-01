const User = require('../models/Users');
const OtpEmail = require('../models/OtpEmail');
const { getExpiryTime, compareExpiryDate } = require('../util/commonFunctions');

//function to save otp and expiry
const saveOtp = async (otp) => {
    try {
        let expiry = getExpiryTime(new Date(), 5);
        let saveObj = new OtpEmail({
            otp,
            expiry
        });

        let result = await saveObj.save();

        if (result) {
            return result;
        }

        return false;
    } catch (error) {
        console.log("Error in saveOtp: ", error);
        return false;
    }
}

//funtion to save otpid against each user
const saveEmailAndOtp = async (email, otpId) => {
    try {
        let saveObj = new User({
            email,
            otpId
        });

        let result = await saveObj.save();

        if (result) {
            return result;
        }

        return false;

    } catch (error) {
        console.log("Error in saveEmailAndOtp: ", error);
        return false;
    }
}

//function to verify otp
const verifyOtp = async (email, otp) => {
    try {
        let result = await User.aggregate([{
            $match: {
                email
            }
        }, {
            $lookup: {
                from: "otpemails",
                localField: "otpId",
                foreignField: "_id",
                as: "otpData"
            }
        },{
            $unwind: {
                "path": "$otpData",
                "preserveNullAndEmptyArrays": true
            }
        }, {
            $project: {
                "email": 1,
                "otpId":1,
                "otp": "$otpData.otp",
                "expiry": "$otpData.expiry",
                "isUsed": "$otpData.isUsed"
            }
        }]);
        console.log("result", JSON.stringify(result))
        if (result && !result[0].isUsed) {
            let compareResult = compareExpiryDate(result[0].expiry);
            if (compareResult) {
                if(result[0].otp === otp) {
                    let updateUserResult = await User.updateOne({email},{
                        $set: {
                            "verified": true
                        }
                    });
                    if(updateUserResult){
                        let updateOtpEmailsResult = await OtpEmail.updateOne({_id: result[0].otpId},{
                            $set: {
                                "isUsed": true
                            }
                        });
                        if(updateOtpEmailsResult){
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false
                }
            } else {
                return false;
            }
        }
        return false;
    } catch (error) {
        console.log("Error in verify OTP: ", error);
        return false
    }
}

//function to check if user is present or not
const checkUser = async (email) => {
    try {
        let result = await User.findOne({email});
        if(result){
            return result;
        }
        return false;
    } catch (error) {
        console.log("Error in check user: ", error);
        return false
    }
}

//function to update otp and expiry on every login
const updateOtp = async (id, otp) => {
    try {
        let updateOtpEmailsResult = await OtpEmail.updateOne({_id: id},{
            $set: {
                "isUsed": false,
                "otp": otp,
                "expiry": getExpiryTime(new Date(), 5)
            }
        });
        if(updateOtpEmailsResult){
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Error in update otp: ", error);
        return false
    }
}

//function to update basic details of user
const updateUserDetails = async (email, firstName, lastName) => {
    try {
        let result = await User.updateOne({email},{
            $set: {
                firstName,
                lastName
            }
        });
        if(result){
            return result;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Error in update user details: ", error);
        return false
    }
}

module.exports = {
    saveEmailAndOtp,
    saveOtp,
    verifyOtp,
    checkUser,
    updateOtp,
    updateUserDetails
}