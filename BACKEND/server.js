const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();
app.use(express.urlencoded({ extended: true })); // For form data
const {notFound , errorHandler} = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");

app.use(express.json());
dotenv.config();
const port = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());
connectDB();


app.get("/", (req, res) => {
    res.send("server working");
});

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port,()=> console.log(`listening on port ${port}...`));

const io =  require('socket.io')(server , {
    pingTimeout : 60000,
    cors : {
        origin : "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);

        socket.emit("connected");
    })

    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log('User Joined Room : '+ room);
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(chat._id).emit('message recieved', newMessageRecieved);
        })
        
    })

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})