var express = require('express');
const router = require('./router/router.js')
//var con = require("./conn.js");
var app = express();
var PORT = 3000;

//setting external router
app.use('/',router)

// View engine setup
app.set('view engine', 'ejs');
 
app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});

  