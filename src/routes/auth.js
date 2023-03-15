const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');

const exp = express()
exp.use(cookieParser());
require('../db/conn')
const Admin = require('../models/admin');
const Police = require('../models/police');

router.get('/', (req, res) => {
    res.send("hello home")
})

router.post('/register', async (req, res) => {
    // console.log("hi1")
    const { name, id, bday, email, adhaar, password, mobile, gender, address, registerfor } = req.body;
    try {
        if (registerfor === 'Admin') {
            // console.log("hi2")
            const ae = await Admin.findOne({ aEmail: email })
            const aa = await Admin.findOne({ aAdhaar: adhaar })
            const am = await Admin.findOne({ aMobile: mobile })
            const ai = await Admin.findOne({ aId: id })
            if (ae || aa || am || ai) {
                // console.log('a :>> ', ae);
                return res.status(422).json({ err: "admin already exist" })
            }
            console.log("hi3")
            const admin = new Admin({ aName: name, aId: id, aBday: bday, aEmail: email, aAdhaar: adhaar, aPassword: password, aMobile: mobile, aGender: gender, aAddress: address })
            // console.log("hi4")
            //calling pre method before save
            const savedAdmin = await admin.save()
            // console.log("hi5")
            console.log('Admin :>> ', savedAdmin);
            return res.status(200).json({ success: "admin registered" })
        }
        else if (registerfor === 'Police') {
            const e = await Police.findOne({ pEmail: email })
            const a = await Police.findOne({ pAdhaar: adhaar })
            const m = await Police.findOne({ pMobile: mobile })
            const i = await Police.findOne({ pId: id })
            if (e || a || m || i) {
                return res.status(422).json({ err: "police already exist" })
            }
            const police = new Police({ pName: name, pId: id, pBday: bday, pEmail: email, pAdhaar: adhaar, pPassword: password, pMobile: mobile, pGender: gender, pAddress: address })
            //calling pre method before save
            const savedPolice = await police.save()
            console.log('Police :>> ', savedPolice);
            return res.status(200).json({ success: "police registered" })
        }

    } catch (err) {
        console.log('err in register :>> ', err);
    }
}
)

router.post('/login', async (req, res) => {
    const { uname, password, person } = req.body;
    console.log('password :>> ', password);
    if (person === 'admin') {
        try {
            res.cookie('key', 'admin')
        }
        catch (e) {
            console.log("error : ", e);
        }
        const a = await Admin.findOne({ aId: uname });
        if (!a) {
            return res.status(400).json({ err: 'invalid details of admin ' })
        }
        if (a) {
            const isMatch = await bcrypt.compare(password, a.aHashPassword);
            const token = await a.generateAuthToken();
            console.log('token :>> ', token);
            res.cookie("adminToken", token);
            if (!isMatch)
                return res.status(400).json({ err: "invalid details of admin " })
            else {

                console.log('admin req.cookies 1 : ', req.cookies)
                return res.json({ success: "admin login successful" })
            }
        }
    } else if (person === 'police') {
        const p = await Police.findOne({ pId: uname });
        if (!p) {
            return res.status(400).json({ err: 'invalid details of police' })
        }
        console.log('p.pPassword :>> ', p.pPassword);
        const isMatch = await bcrypt.compare(password, p.pHashPassword);

        if (!isMatch)
            return res.status(400).json({ err: "invalid details of police " })
        else {
            // const token = await a.generateAuthToken();
            // console.log('token :>> ', token);
            // res.cookie("admin '" + a.aName + "' token", token, {
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true
            // })
            // console.log('admin req.cookies 1 : ', req.cookies)
            return res.json({ success: "police login successful" })
        }
    } else if (person === 'user') {

    }

})

module.exports = router;