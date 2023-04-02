const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const superAdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    superId: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    tokens: [{
        token: {
            type: String,
            // required: true,
        }
    }],
})


superAdminSchema.methods.generateAuthToken = async function () {
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

const superAdmin = mongoose.model('superAdmin', superAdminSchema)

module.exports = superAdmin;