var menu_div = document.getElementById("main-menu");
var game_div = document.getElementById("game-menu");

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var player;

var movement = {
    jumping: false,
    falling: false,
    left: false,
    right: false,
    jump_stop: 0
};

function initGame(id) {
    toggleMenu(menu_div, false);
    toggleMenu(game_div, true);

    addPlayer(id);

    document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 65: // A
                movement.left = true;
                break;
            case 68: // D
                movement.right = true;
                break;

        }
    });

    document.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 65: // A
                movement.left = false;
                break;
            case 68: // D
                movement.right = false;
                break;
            case 87: // W
                if (movement.falling == false & movement.jumping == false) {
                    movement.jumping = true;
                    movement.jump_stop = player.Y - 150;
                }
                break;

        }
    });

    setInterval(function () {
        socket.emit('movement', movement);
    }, 1000 / 60);
}

function toggleMenu(ele, bool) {
    if (bool != undefined) {
        ele.classList.toggle("hidden", !bool);
    } else {
        ele.classList.toggle("hidden");
    }
}

function addPlayer(id) {
    var pos_x = Math.floor(Math.random() * 799) + 1;
    var pos_y = 500; //Math.floor(Math.random() * 599) + 1;

    var player_image = "../Assets/characters/char1.png";


    player = {
        ID: id,
        X: pos_x,
        Y: pos_y,
        falling: false,
        jumping: false,
        image: player_image
    };

    socket.emit('add-player', player);
}

function playerState(players) {
    context.clearRect(0, 0, 800, 600);

    for (var id in players) {
        var p = players[id];

        //If this is you, update your object with new data
        if (id == player.ID) {
            player = p;
        }

        var img = new Image();
        img.src = p.image;


        context.drawImage(img, p.X, p.Y, 50, 100);

    }
}