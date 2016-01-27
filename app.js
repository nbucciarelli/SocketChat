var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
  // res.send("<h1>Hello World</h1>")
  res.sendFile(__dirname + '/views/index.html')
});

// app.use(express.static(path.join(__dirname, 'css')));
var people = {};
io.on('connection', function(socket){
  socket.on('join', function(username) {
    people[socket.id] = username;
    io.emit("update", "You have connected to the server.");
    io.emit("update", username + " has joined the server.");
    io.emit("update-people", people);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit("update", people[socket.id] + " has left the server.");
    delete people[socket.id];
    io.emit("update-people", people);
  });
  socket.on('send', function(data) {
    console.log("message: " + data);
    io.emit("chat", people[socket.id], data);
  });
});

server.listen(3000, function() {
  console.log("Listening on *:3000");
});

