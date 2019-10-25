var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var players = {};

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
        if (players[socket.id] == undefined) {
            players[socket.id] = socket.id;
            console.log("Socket list:");
            console.log(players);

            io.emit('user-joined', socket.id);
            socket.emit('init-game', socket.id);
        }
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('user-disconnected', socket.id);

        delete players[socket.id];
    });


    socket.on('add-player', function (player) {
        players[player.ID] = player;
        console.log(players);
    });

    socket.on('movement', function (data) {
        var player = players[socket.id] || {};

        if (data.left) {
            player.X -= 5;
        }
        if (data.jumping) {
            if (data.jump_stop < player.Y) {
                player.Y -= 5;
            }
        }
        if (data.right) {
            player.X += 5;
        }
        if (data.falling) {

            player.Y += 5;
        }
    });

});

setInterval(function () {
    io.sockets.emit('state', players);
}, 1000 / 60);