const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const challanSchema = mongoose.Schema({
    policeName: {
        type: String,
    },
    policeId: {
        type: String,
    },
    vehicleType: {
        type: String,
    },
    vehicleNum: {
        type: String,
    },
    offense: {
        type: String,
    },
    place: {
        type: String,
    },
    time: {
        type: String,
    },
    amount: {
        type: Number
    },
    date: {
        type: String,
    },
    dueDate: {
        type: String,
    },
    status: {
        type: String,
    },
    //users info
    user: {
        type: String,
    },
    licenseNo: {
        type: String,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
})

const Challan = mongoose.model('Challan', challanSchema)

module.exports = Challan;