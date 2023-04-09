const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    aadharNo: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    licenseNo: {
        type: String,
        required: true,
    },
    vehicleNo: [{
        type: String,
        // required: true,
    }],
    tokens: [{
        token: {
            type: String,
            // required: true,
        }
    }],
})


userSchema.methods.generateAuthToken = async function () {
    try {
        const newToken = jwt.sign({ _id: this._id }, 'hellothisistheprojectofdesighnengineeringechallan');
        this.tokens = this.tokens.concat({ token: newToken });
        // console.log('token :>> ', newToken);
        await this.save();
        return newToken;
    } catch (err) {
        console.log('err :>> ', err);
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User;