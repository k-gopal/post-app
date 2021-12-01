const mongoose = require("mongoose");

//model for storing otp and its expiry time against each user
const schema = new mongoose.Schema({
    otp: {
        type: Number, 
        required: true,
    },
    expiry: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('OtpEmail', schema);
