const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://sameerpawar:shivvaa123@cluster0.hwotpn1.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("connnected to  Task Database")
    })
    .catch(err => {
        console.log(err)
    })
const schema = mongoose.Schema
const taskSchema = new schema({
    activity: { type: String },
    status: { type: String },
    time: { type: String },
    action: { type: String },
    timetaken: { type: String },
    ref: { type: String }
})

let Task = mongoose.model("todotask1", taskSchema);
module.exports = Task