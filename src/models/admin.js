const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const adminSchema = mongoose.Schema({
    aName: {
        type: String,
        required: true,
    },
    aId: {
        type: String,
        required: true,
        unique: true
    },
    aEmail: {
        type: String,
        required: true,
        unique: true
    },
    aGender: {
        type: String,
        required: true,
    },
    aMobile: {
        type: Number,
        required: true,
        unique: true
    },
    aAdhaar: {
        type: Number,
        required: true,
        unique: true
    },
    aBday: {
        type: String,
        required: true,
    },
    aPassword: {
        type: String,
        required: true,
    },
    aHashPassword: {
        type: String,
        // required: true,
    },
    aAddress: {
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

// convert password into hash
adminSchema.pre("save", async function (next) {
    if (this.isModified("aPassword")) {
        const hash = await bcrypt.hash(this.aPassword, 12);
        console.log('password : ', this.aPassword)
        console.log('hash :>> ', hash);
        this.aHashPassword = hash;
        // console.log('hashed password : ', this.password)
    }
    next();
})

adminSchema.methods.generateAuthToken = async function () {
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

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin;