const mongoose = require("mongoose");

//model to details of each poast created by users
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    comments:{
        type: Array,
        required: false
    },
    likes: {
        type: Array,
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: String,
        required: true
    }
},{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Posts', schema);
