var express = require('express');
var app = express();
var fs = require('fs');


var ssl_options = {
  pfx : fs.readFileSync("pem/1.pfx"),passphrase: '1'

};
var server = require('https').Server(ssl_options,app);

var io = require("socket.io")(server, {
  secure:true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"], 
    credentials: true
  },
  rejectUnauthorized: false
});





var port = process.env.PORT || 3000; 
server.listen(port, function () {
    console.log('Updated : Server listening at port %d', port);
});
app.use('/js',  express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));
var usernames = {};
var numUsers = 0; 



io.on('connection', function (socket) {
var addedUser = false;
socket.on('new message', function (data) {
  console.log("new mesage");
  console.log(data);
  socket.broadcast.emit('new message', {
    username: socket.username,
    message: data,
    timestamp: Date.now()
  });
 
});

// when the client emits 'add user', this listens and executes
socket.on('add user', function (username) {
  // we store the username in the socket session for this client
  socket.username = username;
  // add the client's username to the global list
  usernames[username] = username;
  ++numUsers;
  addedUser = true;
  socket.emit('login', {
    numUsers: numUsers
  });
  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUsers: numUsers
  });
});

// when the client emits 'typing', we broadcast it to others
socket.on('typing', function () {
  socket.broadcast.emit('typing', {
    username: socket.username
  });
});

// when the client emits 'stop typing', we broadcast it to others
socket.on('stop typing', function () {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  });
});

// when the user disconnects.. perform this
socket.on('disconnect', function () {
  // remove the username from global usernames list
  if (addedUser) {
    delete usernames[socket.username];
    --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: numUsers
    });
  }
});
});