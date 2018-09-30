const path = require("path");
const express = require("express");

var constPath  = path.join(__dirname,'../public');
const port = process.env.PORT||3000

//console.log(__dirname);
//console.log(constPath);

const app = express();

app.use(express.static(constPath))

app.listen(port,function(req,res,next){
    console.log(`Listening on port ${port}`)
})





