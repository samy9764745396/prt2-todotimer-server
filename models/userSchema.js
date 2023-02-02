const mongoose =require("mongoose")

mongoose.connect("mongodb+srv://sameerpawar:shivvaa123@cluster0.hwotpn1.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("connnected to User Database")
})
.catch(err=>{
    console.log(err)
})
const schema = mongoose.Schema
const userSchema= new schema({
    email:{type:String},
    password:{type:String}
})

let USer=mongoose.model("todoUser1",userSchema);
module.exports=USer