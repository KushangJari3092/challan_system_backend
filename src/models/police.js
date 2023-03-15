const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const policeSchema = mongoose.Schema({
    pName: {
        type: String,
        required: true,
    },
    pId: {
        type: String,
        required: true,
        // unique: true
    },
    pEmail: {
        type: String,
        required: true,
        unique: true
    },
    pGender: {
        type: String,
        required: true,
    },
    pMobile: {
        type: Number,
        required: true,
        unique: true
    },
    pAdhaar: {
        type: Number,
        required: true,
        unique: true
    },
    pBday: {
        type: String,
        required: true,
    },
    pPassword: {
        type: String,
        required: true,
    },
    pHashPassword: {
        type: String,
        // required: true,
    },
    pAddress: {
        type: String,
        required: true,
    },
})

// convert password into hash
policeSchema.pre("save", async function (next) {
    if (this.isModified("pPassword")) {
        const hash = await bcrypt.hash(this.pPassword, 12);
        console.log('password : ', this.pPassword)
        console.log('hash :>> ', hash);
        this.pHashPassword = hash;
        // console.log('hashed password : ', this.password)
    }
    next();
})


const Police = mongoose.model('Police', policeSchema)

module.exports = Police;