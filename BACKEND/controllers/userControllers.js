const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const genrateToken = require('../config/genrateToken');


const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    console.log(name, email, password);
   
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Plese Enter All the Feilds");
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User Exists");
    }
   
    const user = await User.create({
        name,
        email,
        password,
    });
    console.log("done");

    if(user){
        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : genrateToken(user._id)
        })
    }else{
        res.status(404);
        throw new Error("failed to create user");
    }
});

const authUser =asyncHandler( async(req,res)=>{
    const {email , password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : genrateToken(user._id)
        });
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

});

const allUsers = asyncHandler(async(req, res)=>{
    const keyword = req.query.search ?{
        $or :[
            {name : {$regex : req.query.search , $options : "i"}},
            {email : {$regex : req.query.search , $options : "i"}}
        ]
    }:{}
    
    const users = await User.find(keyword).find({_id:{$ne : req.user._id}});
    res.send(users);
});

module.exports = {registerUser , authUser, allUsers};