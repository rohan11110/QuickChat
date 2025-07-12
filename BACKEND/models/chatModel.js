const mongoose = require('mongoose');


const chatModel = mongoose.Schema({
    chatName: {type:String , trim : true},
    isGroupChat : {type : Boolean , defalut : false},
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref :  "User",
    },],
    latestMessage : {type : mongoose.Schema.Types.ObjectId, ref : "Message"},
    groupAdmin : {type : mongoose.Schema.Types.ObjectId, ref : "User" },
},
 {
    timestapms : true,
}); 

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;