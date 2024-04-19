const express = require('express')
const exp = express()
const cors = require('cors')
exp.use(express.json())

const cookieParser = require('cookie-parser');
exp.use(cookieParser());
exp.use(cors({
    origin: "https://662238ba251134ae9b8ac870--singular-sprinkles-a2c4bf.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


require('./src/db/conn');
exp.use(require('./src/routes/auth.js'))

exp.listen(7100, () => {
    console.log("running on port 7100")
})

