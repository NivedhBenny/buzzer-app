// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let buzzerWinner = null;  // Keep track of who buzzed first

// Serve the front-end
app.use(express.static(__dirname + '/public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Handle a buzzer click
    socket.on('buzz', (data) => {
        if (!buzzerWinner) {
            buzzerWinner = data.user;
            io.emit('buzzer-winner', { user: buzzerWinner });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });

    // Optionally add a reset feature for new rounds
    socket.on('reset', () => {
        buzzerWinner = null;
        io.emit('reset');
    });
});


// Start the server
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
