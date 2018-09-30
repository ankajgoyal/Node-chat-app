var socket = io();
socket.on("connect",()=>{
    console.log("Connected to Server")

    // socket.emit("createEmail",{
    //     to:"billgates@microsoft.com",
    //     text:"You are very kind"
    // })

    // socket.emit("createMessage",{
    //     to:"Mamta",
    //     text:"Hi there"
    // })
}) 
socket.on("disconnect",function(){
    console.log("Disconnected from Server")
})
socket.on("newEmail",function(newEmail){
    console.log("New Email",newEmail)
})
socket.on("newMessage",function(message){
    console.log("New Message",message);
    var li =jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);

})

socket.on("Welcome",()=>{
    console.log("Welcome to the chat App")
})
socket.on("NewUser",()=>{
    console.log("New User has")
})


jQuery("#form-message").on("submit",function(e){
    e.preventDefault();
    socket.emit("createMessage",{
        from:"User",
        text:jQuery('[name=message]').val()
    },function(){

    })
})