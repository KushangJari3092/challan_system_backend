const express = require('express')
const exp = express()
const cors = require('cors')
exp.use(express.json())

const cookieParser = require('cookie-parser');
exp.use(cookieParser());
exp.use(cors());

// exp.use((req, res, next) => {
//   res.header({"Access-Control-Allow-Origin": "*"});
//   next();
// }) 

require('./src/db/conn');
exp.use(require('./src/routes/auth.js'))

exp.listen(7100, () => {
    console.log("running on port 7100")
})

