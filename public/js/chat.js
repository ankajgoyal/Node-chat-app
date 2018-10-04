var socket = io();

function scrollToBottom(){
    var messages = jQuery("#messages");
    var newMessage = messages.children('li:last-child')
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight(); 

    if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on("connect",()=>{
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href='/'
        }
        else{
            console.log("No error");
        }
    })
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
    var formattedTime = moment(message.createdAt).format('h:mm:a')
    // console.log("New Message",message);
    // var li =jQuery('<li></li>');
    // li.text(`${message.from}: ${formattedTime}:${message.text}`);
    // jQuery('#messages').append(li);
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template,{
        text:message.text,
        createdAt:formattedTime,
        from:message.from
    })
    jQuery("#messages").append(html);
    scrollToBottom();
})

socket.on("createLocationMessage",function(message){
    var formattedTime = moment(message.createdAt).format('h:mm:a')
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template,{
        from : message.from,
        createdAt:formattedTime,
        url:message.url
    })
    // var a = jQuery('<a target="_blank">My Current Location</a>')
    // li.text(`${message.from}:${formattedTime}`)
    // a.attr('href',message.url );
    // li.append(a);
    jQuery("#messages").append(html);
    scrollToBottom();

})

socket.on("usersUpdatedList",function(users){
    console.log(users);
var ol = jQuery('<ol></ol>');
users.forEach(function(user){
    ol.append(jQuery("<li></li>").text(user))
})
jQuery("#users").html(ol);
})

socket.on("Welcome",()=>{
    console.log("Welcome to the chat App")
})
socket.on("NewUser",()=>{
    console.log("New User has")
})


jQuery("#message-form").on("submit",function(e){
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    socket.emit("createMessage",{
        from:"User",
        text:jQuery('[name=message]').val()
    },function(){
        messageTextbox.val('')
    })
})

var locationButton = jQuery("#send-location");
locationButton.on('click',function(){
    if(!navigator.geolocation){
        alert("Your broswer does  not support geolocation")
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit("createCurrentLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    },function(){
        alert("Unable to fetch the posittion")
    })
})