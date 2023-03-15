const express = require('express')
const exp = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
exp.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
exp.use(express.json())
exp.use(cookieParser());

require('./db/conn');
exp.use(require('./routes/auth.js'))


// exp.post('/post', (req, res) => {
//     console.log('data :>> ', req.body);
//     try {
//         res.send("ok")
//     } catch (err) {
//         res.send(err)
//     }
// })



exp.listen(7100, () => {
    console.log("running on port 7100")
}) 