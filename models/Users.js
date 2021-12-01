const mongoose = require("mongoose");

//model to store basic details of users
const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    otpId: {
        type: mongoose.Types.ObjectId,
        ref: "otpemails",
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isLoggedIn: {
        type: Boolean,
        required: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Users', schema);
