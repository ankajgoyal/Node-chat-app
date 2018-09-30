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

    socket.on("disconnect",()=>{
        console.log("User Disconnected");
    })

})

app.use(express.static(constPath))

server.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})





