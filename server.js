const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let players = {};

io.on('connection', (socket) => {
    console.log('A player connected: ' + socket.id);

    players[socket.id] = {
        x:30,
        y:520,
        username:`player ${socket.id}`,
        details:'not available',
        name_details:"No name"
    };

    

    io.emit('players', players);

    socket.on('button-press', (data) => {
        console.log(`${data.playerId} pressed ${data.button}`);

        io.emit('button-pressed', data);
    });


    socket.on('player-move', (data) => {
        if (players[data.playerId]) {
            players[data.playerId].x = data.x;
            players[data.playerId].y = data.y;
            
            socket.broadcast.emit('player-move', {
                playerId: data.playerId,
                x: data.x,
                y: data.y
            });
        }
    });





    // players[socket.id] = {
    //     x: 100,  // Starting X position
    //     y: 100,  // Starting Y position
    //     username: `Player ${socket.id}`
    // };

    // // Send the current players to the new player
    // socket.emit('currentPlayers', players);

    // // Broadcast the new player to all other players
    // socket.broadcast.emit('newPlayer', { id: socket.id, username: players[socket.id].username });

    // // Listen for player movement updates
    // socket.on('playerMovement', (movementData) => {
    //     if (players[socket.id]) {
    //         players[socket.id].x = movementData.x;
    //         players[socket.id].y = movementData.y;
    //     }

    //     // Broadcast movement to all other players
    //     socket.broadcast.emit('playerMoved', { id: socket.id, x: movementData.x, y: movementData.y });
    // });

    // // When the player disconnects, remove them
    // socket.on('disconnect', () => {
    //     console.log('Player disconnected: ' + socket.id);
    //     delete players[socket.id];

    //     // Broadcast to other players that a player has left
    //     socket.broadcast.emit('playerDisconnected', socket.id);
    // });
});





// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
