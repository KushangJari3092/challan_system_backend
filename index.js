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

require('./src/db/conn');
exp.use(require('./src/routes/auth.js'))

exp.listen(7100, () => {
    console.log("running on port 7100")
})

