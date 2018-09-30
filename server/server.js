const path = require("path");
const express = require("express");

var constPath  = path.join(__dirname,'../public');

//console.log(__dirname);
//console.log(constPath);

const app = express();

app.use(express.static(constPath))

app.listen(3000,function(req,res,next){
    console.log("Listening on port 3000")
})





