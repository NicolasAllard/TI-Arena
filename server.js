var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var users = {};

server.listen(3000);


app.use(express.static(path.join(__dirname, 'public')));

//Redirect the user to the index if he connects to the site
app.get('/', function (req, res) {
    res.redirect("/index.html");
});

//If the user is trying to reach the index, send him the index file
app.get('/index.html', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

//On user connection
io.on('connection', function (socket) {

    //If the user is new, 
    socket.on('new-user', function () {
        users[socket.id] = socket.id;
    });

    socket.on('disconnect', function () {
        //socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});