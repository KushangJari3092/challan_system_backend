const express = require('express')
const exp = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
exp.use(cors({
    origin: "https://662238ba251134ae9b8ac870--singular-sprinkles-a2c4bf.netlify.app/",
    credentials: true,
}));
exp.use(express.json())
exp.use(cookieParser());

require('./src/db/conn');
exp.use(require('./src/routes/auth.js'))

exp.listen(7100, () => {
    console.log("running on port 7100")
})

