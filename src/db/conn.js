const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb+srv://KushangJariwala:kushang3092@cluster0.myllqta.mongodb.net/challan?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => { console.log("db connected") })
    .catch((err) => { console.log('err in db :>> ', err); })