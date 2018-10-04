const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const moment = require('moment');

var constPath  = path.join(__dirname,'../public');
const {Users} = require('./utils/users')
const port = process.env.PORT||3000

//console.log(__dirname);
//console.log(constPath);

const app = express();
const server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var generateLocationMessage=(from ,latitude ,longitude)=>{
    return{
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt:moment().valueOf()
    }

};

var isRealString = (str)=>{
    return typeof str==="string" && str.trim().length>0;
};

io.on("connection",(socket)=>{
    console.log("New User Connected");

   

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name)|| ! isRealString(params.room)){
             return callback("Name and Room are Required")
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id ,params.name,params.room);
        io.to(params.room).emit("usersUpdatedList",users.getUserList(params.room))

        socket.emit("newMessage",{from:"Admin",text:"Welcome to the chat App"});
        socket.broadcast.to(params.room).emit("newMessage",{from:"Server",text: `${params.name} has joined`,createdAt:new Date().getTime})
        callback();
    })
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
            createdAt:moment().valueOf()
        });
        callback("This is from server")
        // socket.broadcast.emit("newMessage",{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime
        // })

    })

    socket.on("createCurrentLocation",(coords)=>{
        io.emit("createLocationMessage",generateLocationMessage("Admin",coords.latitude,coords.longitude))
        // socket.on("createEmail",(createEmail)=>{
    //     console.log("create Email",createEmail)
    // })

    })
    socket.on("disconnect",()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('usersUpdatedList',users.getUserList(user.room))
            io.to(user.room).emit("newMessage",{from:"Admin",text:`${user.name } has left`,createdAt:new Date().getTime})
        }

    })

})

app.use(express.static(constPath))

server.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})







