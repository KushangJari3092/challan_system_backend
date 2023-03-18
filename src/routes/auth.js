const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
                return res.status(422).json({ err: "already exist" })
            }
            console.log("hi3")
            const admin = new Admin({ aName: name, aId: id, aBday: bday, aEmail: email, aAdhaar: adhaar, aPassword: password, aMobile: mobile, aGender: gender, aAddress: address })
            // console.log("hi4")
            //calling pre method before save
            const savedAdmin = await admin.save()
            // console.log("hi5")
            // console.log('Admin :>> ', savedAdmin);
            return res.status(200).json({ success: "registration successful" })
        }
        else if (registerfor === 'Police') {
            const e = await Police.findOne({ pEmail: email })
            const a = await Police.findOne({ pAdhaar: adhaar })
            const m = await Police.findOne({ pMobile: mobile })
            const i = await Police.findOne({ pId: id })
            if (e || a || m || i) {
                return res.status(422).json({ err: "already exist" })
            }
            const police = new Police({ pName: name, pId: id, pBday: bday, pEmail: email, pAdhaar: adhaar, pPassword: password, pMobile: mobile, pGender: gender, pAddress: address })
            //calling pre method before save
            const savedPolice = await police.save()
            // console.log('Police :>> ', savedPolice);
            return res.status(200).json({ success: "registration successful" })
        }

    } catch (err) {
        console.log('err in register :>> ', err);
    }
}
)

router.post('/login', async (req, res) => {
    const { uname, password, person } = req.body;
    if (person === 'admin') {
        const admin = await Admin.findOne({ aId: uname });
        if (!admin) {
            return res.status(400).json({ err: 'invalid details of admin ' })
        }
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.aHashPassword);
            if (!isMatch)
                return res.status(400).json({ err: "invalid details of admin " })
            else {
                const token = await admin.generateAuthToken();
                // console.log('admin token :>> ', token);
                res.cookie("adminToken", token,
                    {
                        expires: new Date(Date.now() + 3600 * 24 * 365),
                        // httpOnly: true
                    }
                );
                res.cookie('person', 'admin'
                    ,
                    {
                        expires: new Date(Date.now() + 3600 * 24 * 365),
                        // httpOnly: true
                    }
                )

                return res.json({ success: "Login Successfully", ...admin._doc });
            }
        }
    } else if (person === 'police') {
        const p = await Police.findOne({ pId: uname });
        if (!p) {
            return res.status(400).json({ err: 'invalid details of police' })
        }
        if (p) {
            const isMatch = await bcrypt.compare(password, p.pHashPassword);
            if (!isMatch)
                return res.status(400).json({ err: "invalid details of police " })
            else {
                const token = await p.generateAuthToken();
                // console.log('police token :>> ', token);
                res.cookie("policeToken", token, {
                    expires: new Date(Date.now() + 9999999999),
                })
                res.cookie('person', 'police', {
                    expires: new Date(Date.now() + 9999999999),
                })
                return res.json({ success: "login successful" })
            }
        }

    } else if (person === 'user') {

    }

})

router.get('/logout', (req, res) => {
    if (req.cookies.person === 'admin') {
        res.clearCookie('adminToken');
        res.clearCookie('person')
    }
    else if (req.cookies.person === 'police') {
        res.clearCookie('policeToken');
        res.clearCookie('person')
    }
    else if (req.cookies.person === 'user') {
        res.clearCookie('userToken');
        res.clearCookie('user')
    }
    return res.json({ loggedOut: req.cookies.person + " logged out" })
})

router.get('/getData', async (req, res) => {
    try {
        console.log('req.cookies police:>> ', req.cookies);
        if (req.cookies.person === 'admin') {
            const token = req.cookies.adminToken;
            const admin = await Admin.findOne({ "tokens.token": token })
            // console.log('admin :>> ', admin);
            res.send(admin);
        }
        else if (req.cookies.person === 'police') {
            const token = req.cookies.policeToken;
            const police = await Police.findOne({ "tokens.token": token })
            // console.log('admin :>> ', admin);
            res.send(police);
        }
    } catch (err) {
        console.log('err in adminInfo auth :>> ', err);
    }
})
module.exports = router;