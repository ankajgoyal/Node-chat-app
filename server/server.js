const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

var constPath  = path.join(__dirname,'../public');
const port = process.env.PORT||3000

//console.log(__dirname);
//console.log(constPath);

const app = express();
const server = http.createServer(app);
var io = socketIO(server);
io.on("connection",(socket)=>{
    console.log("New User Connected");

    socket.emit("newMessage",{from:"Admin",text:"Welcome to the chat App"});
    socket.broadcast.emit("newMessage",{from:"Server",text:"New user has joined",createdAt:new Date().getTime})

    // socket.emit("newEmail",{
    //     from:"billgates@microsoft.com",
    //     text:"My all wealth is yours"
    // });

    // socket.emit("newMessage",{
    //     from:"Mamta",
    //     text:"Whats up",
    //     createdAt:"Today"
    // })

    socket.on("createMessage",(message,callback)=>{
        //console.log("Create message",message)
        io.emit("newMessage",{
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime
        });
        callback("This is from server")
        // socket.broadcast.emit("newMessage",{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime
        // })

    })
    // socket.on("createEmail",(createEmail)=>{
    //     console.log("create Email",createEmail)
    // })

    socket.on("disconnect",()=>{
        console.log("User Disconnected");
    })

})

app.use(express.static(constPath))

server.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})





