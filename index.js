var express = require("express");
var app = express();
var port = 3700;
 
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.configure(function() {
	io.disable('log');
	app.use(express.static(__dirname + '/static'));
});

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

require('./io')(io);