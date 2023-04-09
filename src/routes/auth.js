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
const superAdmin = require('../models/superAdmin');
const User = require('../models/users');
const Challan = require('../models/challans');

router.get('/', (req, res) => {
    res.send("hello home")
})

router.post('/register', async (req, res) => {
    const { name, id, bday, email, adhaar, password, mobile, gender, address, registerfor } = req.body;
    try {
        if (registerfor === 'Admin') {
            const ae = await Admin.findOne({ aEmail: email })
            const aa = await Admin.findOne({ aAdhaar: adhaar })
            const am = await Admin.findOne({ aMobile: mobile })
            const ai = await Admin.findOne({ aId: id })
            if (ae || aa || am || ai) {
                return res.status(422).json({ err: "already exist" })
            }
            console.log("hi3")
            const admin = new Admin({ aName: name, aId: id, aBday: bday, aEmail: email, aAdhaar: adhaar, aPassword: password, aMobile: mobile, aGender: gender, aAddress: address })
            //calling pre method before save
            const savedAdmin = await admin.save()
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
        const superadmin = await superAdmin.findOne({ superId: uname });

        if (!superadmin && !admin) {
            return res.status(400).json({ err: 'invalid details' })
        }
        else if (superadmin) {
            // console.log('superadmin :>> ', superadmin);
            if (superadmin.password != password)
                return res.status(400).json({ err: "invalid details " })
            else {
                const token = await superadmin.generateAuthToken();
                res.cookie("superAdminToken", token, { expires: new Date(Date.now() + 3600 * 24 * 365), });
                res.cookie('person', 'superAdmin', { expires: new Date(Date.now() + 3600 * 24 * 365), })

                return res.json({ success: "Login Successfully", ...superadmin._doc });
            }
        }
        else if (admin) {
            // console.log('admin :>> ', admin);
            const isMatch = await bcrypt.compare(password, admin.aHashPassword);
            if (!isMatch)
                return res.status(400).json({ err: "invalid details of admin " })
            else {
                const token = await admin.generateAuthToken();
                res.cookie("adminToken", token, { expires: new Date(Date.now() + 3600 * 24 * 365), });
                res.cookie('person', 'admin', { expires: new Date(Date.now() + 3600 * 24 * 365), })

                return res.json({ ...admin._doc, success: "Login Successfully" });
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
                    expires: new Date(Date.now() + 3600 * 24 * 365),
                })
                res.cookie('person', 'police', {
                    expires: new Date(Date.now() + 3600 * 24 * 365),
                })
                return res.json({ ...p._doc, success: "login successful" })
            }
        }
    }
    else if (person === 'user') {
        const user = await User.findOne({ vehicleNo: uname });

        if (!user) {

            return res.status(400).json({ err: 'vehicle does not exists' })
        }
        if (user) {
            const token = await user.generateAuthToken();

            const challan = await Challan.find({ vehicleNum: uname });
            console.log('challan :>> ', challan);
            res.cookie("userToken", token, {
                expires: new Date(Date.now() + 3600 * 24 * 365),
            })
            res.cookie('person', 'user', {
                expires: new Date(Date.now() + 3600 * 24 * 365),
            })

            return res.json({ ...challan, success: "login successful" })

        }
    }

})

router.get('/logout', (req, res) => {
    if (req.cookies.person === 'superAdmin') {
        res.clearCookie('superAdminToken');
        res.clearCookie('person')
    }
    else if (req.cookies.person === 'admin') {
        res.clearCookie('adminToken');
        res.clearCookie('person')
    }
    else if (req.cookies.person === 'police') {
        res.clearCookie('policeToken');
        res.clearCookie('person')
    }
    else if (req.cookies.person === 'user') {
        res.clearCookie('userToken');
        res.clearCookie('person')
    }
    return res.json({ loggedOut: req.cookies.person + " logged out" })
})

router.get('/getData', async (req, res) => {
    try {
        if (req.cookies.person === 'superAdmin') {
            const token = req.cookies.superAdminToken;
            const superadmin = await superAdmin.findOne({ "tokens.token": token })
            res.send(superadmin);
        }
        else if (req.cookies.person === 'admin') {
            const token = req.cookies.adminToken;
            const admin = await Admin.findOne({ "tokens.token": token })
            res.send(admin);
        }
        else if (req.cookies.person === 'police') {
            const token = req.cookies.policeToken;
            const police = await Police.findOne({ "tokens.token": token })
            res.send(police);
        }
    } catch (err) {
        console.log('err in adminInfo auth :>> ', err);
    }
})
router.get('/getChallans', async (req, res) => {
    try {
        const challans = await Challan.find();
        // console.log('challans :>> ', challans);
        res.send(challans);
    } catch (err) {
        console.log('err in get challan auth :>> ', err);
    }
})

router.post('/submitChallan', async (req, res) => {
    try {
        const { pname, pid, offense, place, plateNum, vehicleType, date, time, dueDate } = req.body;
        console.log('req.cody :>> ', req.body);
        const citizen = await User.findOne({ "vehicleNo": { "$in": [plateNum] } })
        console.log('citizen :>> ', citizen);
        let amount = 0;
        if (offense === 'Violation of road regulations') { amount = 100; }
        else if (offense === 'Driving without License') { amount = 150; }
        else if (offense === 'Over Speeding') { amount = 200; }
        else if (offense === 'Drunken Driving') { amount = 500; }
        else if (offense === 'offense related to accident') { amount = 400; }
        else if (offense === 'Violation of Parking regulations') { amount = 100; }
        console.log("hii")
        console.log('citizen.... :>> ', citizen.name);
        console.log('citizen.... :>> ', citizen.licenseNo);
        console.log('citizen.... :>> ', citizen.contact);
        console.log('type :>> ', vehicleType);
        const challan = new Challan({
            policeName: pname, policeId: pid, vehicleType: vehicleType, vehicleNum: plateNum, offense, place, time, date, amount,
            user: citizen.name, licenseNo: citizen.licenseNo, mobile: citizen.contact, email: citizen.email, dueDate, status: 'pending'
        })

        await challan.save();
        return res.status(200).json({ success: "challan submitted successfully" })
    }
    catch (err) {
        return res.json({ err: "challan is not submitted" })
    }
})
module.exports = router;