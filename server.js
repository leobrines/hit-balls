var
	express = require('express'),
	app = express(),
	server = require('http').Server(app);
	// socket = require('socket.io')(server);

app.use('/', express.static('./'));

app.get('/', function(req, res){
	res.sendFile('./index.html');	
});

server.listen(8080, function (){
	console.log('Server running on port 8080');
});

