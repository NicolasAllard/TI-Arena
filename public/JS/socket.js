const socket = io('http://localhost:3000');

socket.on('user-joined', function (id) {
    console.log(id + " has enterred the arena!");
});

socket.on('user-disconnected', function (id) {
    console.log(id + 'has left the arena!');
});

socket.on('init-game', function (id) {
    initGame(id);
});

socket.on('state', function (players) {
    playerState(players);

});