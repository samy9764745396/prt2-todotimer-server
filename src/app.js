require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const jwt =require("jsonwebtoken")
const bcrypt= require("bcryptjs")
app.use(express.json())
app.use(cors())
const User = require("../models/userSchema")
const Task =require("../models/todoschema")
const port = process.env.PORT || 4001

app.post("/logIn", async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUser = await User.findOne({ email })
        if (!isUser) {
            res.json({
                message: "Invalid User"
            })
        }
        else {
            const isPassword= await bcrypt.compare(password,isUser.password)
            if (isPassword) {

             let token= jwt.sign({email:isUser.email},process.env.secretkey)
                res.json({
                    message: "success",
                    token:token,
                    email:isUser.email
                })
            }
            else {
                res.json({
                    message: "Invalid User"
                })
            }
        }

    }
    catch (err) {
        res.json({
            message: err.message
        })
    }

})
app.post("/signUp", async (req, res) => {
    const { email, password } = req.body
    try {
       
        let isUser = await User.findOne({ email })
        if (!isUser) {

            bcrypt.hash(password,10,async(err,hashed)=>{

                await User.create({ email, password:hashed})
            })
            

            res.json({
                message: "Registration Sucessfully!"
            })
        }
        else {
            res.json({
                message: "User already Exist!"
            })
        }
    }

    catch (err) {
        res.json({
            message: err.message
        })
    }
})


app.post("/addTasks",async(req,res)=>{

var {user,data}=req.body
try{
    if(data.activity){
       await Task.create({
    activity: data.activity,
    status:data.status,
    time:data.time,
    action: data.action,
    timetaken: data.timetaken,
    ref: user
       })
    }
    const allData=await Task.find({ref:user})
    res.json({
        message:allData
    })
}
catch (err) {
    res.json({
        message: err.message
    })
}
})

app.post("/updateToStart", async(req,res)=>{
    const {id,time,user}= req.body
    try{
        const currentTask= await Task.updateOne({_id:id},{$set:{action:"Ongoing",status:"Ongoing",time:time}})
        const allData=await Task.find({ref:user})
    res.json({
        message:allData
    })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
})

app.post("/updateToPause",async(req,res)=>{
    const {id,user}= req.body
    try{
        let totalTime=""
        let taskPauseAfter=""
        let pauseTime=new Date().getTime()
        const mytask= await Task.find({_id:id})
        if(mytask[0].time){
            let taskTimeTaken=pauseTime-(mytask[0].time)
            taskPauseAfter=parseInt([taskTimeTaken])
            let sec=parseInt(taskTimeTaken/1000)
            if(sec>60){
                var min= parseInt(sec/60);
                sec=sec%60
                
                if(min>60){
                    var hrs=parseInt(min/60)
                    min=min%60
                    
                }
                else{
                    var hrs="00"
                }
            }
            else{
                var min="00";
                var hrs="00"
            }
           
            totalTime=`${hrs}:${min}:${sec}`
        }
        
        const currentTask= await Task.updateOne({_id:id},{$set:{action:"continue",status:"paused",timetaken:totalTime,time:taskPauseAfter}})
        const allData=await Task.find({ref:user})
        res.json({
            message:allData
        })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
})

app.post("/updateToResume",async(req,res)=>{
    const {id,user}= req.body
    try{
        const mytask= await Task.find({_id:id})
        let initialTime=parseInt(mytask[0].time)
        let resumeTime= new Date().getTime()
        let resumedTime=initialTime+resumeTime
        const currentTask= await Task.updateOne({_id:id},{$set:{action:"Ongoing",status:"Ongoing",time:resumedTime}})
        const allData=await Task.find({ref:user})
        res.json({
            message:allData
        })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
})
app.post("/updateToComplete", async(req,res)=>{
    const {id,user}= req.body
    try{
        let totalTime=""
        let endTime=new Date().getTime()
        const mytask= await Task.find({_id:id})
        if(mytask[0].time){
            let taskTimeTaken=endTime-(mytask[0].time)
            let sec=parseInt(taskTimeTaken/1000)
            if(sec>60){
                var min= parseInt(sec/60);
                sec=sec%60
                
                if(min>60){
                    var hrs=parseInt(min/60)
                    min=min%60
                    
                }
                else{
                    var hrs="00"
                }
            }
            else{
                var min="00";
                var hrs="00"
            }
           
            totalTime=`${hrs}:${min}:${sec}`
        }
        
        const currentTask= await Task.updateOne({_id:id},{$set:{action:"",status:"completed",timetaken:totalTime}})
        const allData=await Task.find({ref:user})
        res.json({
            message:allData
        })
        
    }   
    catch (err) {
        res.json({
            message: err.message
        })
    }
})
app.listen(port, () => {
    console.log(`server is running at ${port}`)
})

