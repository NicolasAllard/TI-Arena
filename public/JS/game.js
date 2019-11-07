var menu_div = document.getElementById("main-menu");
var game_div = document.getElementById("game-menu");

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var player;

var movement = {
    left: false,
    right: false,
    jump: false
};

function initGame(id) {
    toggleMenu(menu_div, false);
    toggleMenu(game_div, true);

    addPlayer(id);

    //Start loop
    setInterval(function () {
        socket.emit('movement', movement);
        if (movement.jump) {
            movement.jump = false;
        }
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
    player = id;
    addControls();

    socket.emit('add-player', id);
}

function playerState(players) {
    context.clearRect(0, 0, 800, 600);

    for (var id in players) {
        var p = players[id];

        var img = new Image();
        img.src = p.image;

        context.drawImage(img, p.x, p.y, p.width, p.height);

    }
}

//Player controls
function addControls() {
    document.addEventListener("keydown", function (e) {
        switch (event.keyCode) {
            case 65: // A
                movement.left = true;
                break;
            case 68: // D
                movement.right = true;
                break;

        }
    });

    document.addEventListener("keyup", function (e) {
        switch (event.keyCode) {
            case 65: // A
                movement.left = false;
                break;
            case 68: // D
                movement.right = false;
                break;
            case 32: //Space
                movement.jump = true;
                break;

        }
    });
}