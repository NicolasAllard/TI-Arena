var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

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

            io.emit('user-joined', socket.id);
            socket.emit('init-game', socket.id);
        }
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('user-disconnected', socket.id);

        delete players[socket.id];
    });


    socket.on('add-player', function (id) {
        var pos_x = Math.floor(Math.random() * 799) + 1;
        var pos_y = Math.floor(Math.random() * 599) + 1;
        players[id] = new Player(pos_x, pos_y);
    });

    socket.on('movement', function (data) {
        var player = players[socket.id] || {};
        if (data.left && data.right) {
            player.key = '';
        } else if (data.left) {
            player.key = 'a';
        } else if (data.right) {
            player.key = 'd';
        } else if (!data.right && !data.left) {
            player.key = '';
        }

        if (player.isGrounded && data.jump) {
            player.gravity = -10;
        } else {
            player.gravity = 0.25;
        }

    });
});

setInterval(function () {
    for (var id in players) {
        players[id].update();
    }

    io.sockets.emit('state', players);
}, 1000 / 60);


class Player {
    constructor(x, y, color) {
        this.color = color || '#fff';
        this.dead = false;
        this.direction = '';
        this.key = '';
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.height = 100;
        this.width = 50;
        this.gravity = 0.25;
        this.gravitySpeed = 0;
        this.velocityX = 5;
        this.velocityY = 0;
        this.isGrounded = false;

        this.update = function () {
            this.newPos();
            //this.draw();
        };


        this.newPos = function () {
            //Left right Movement
            if (this.key == 'a') {
                this.x -= this.velocityX;
            }

            if (this.key == "d") {
                this.x += this.velocityX;
            }

            //Gravity
            this.gravitySpeed += this.gravity;
            this.y += this.velocityY + this.gravitySpeed;

            //Check for collisions
            this.hitBottom();
        };

        this.hitBottom = function () {
            var rockbottom = CANVAS_HEIGHT - this.height;
            if (this.y >= rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = 0;
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }
        };

        this.image = "../Assets/characters/char1.png";

        this.constructor.counter = (this.constructor.counter || 0) + 1;
        this._id = this.constructor.counter;
    }
}