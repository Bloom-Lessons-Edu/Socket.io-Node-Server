const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./util/users/chat-users');
const router = require('./router/router');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on('join', ({ name, room }, callback) => {
        const { user, error, message } = addUser({ id: socket.id, name, room });
        if (error) {
            console.log(error);
            return callback(error);
        }
        // join current user socket to a room with a name
        socket.join(user.room);
        console.log("User has joined");
        // Events to the frontend
        // welcome message for a new user - to user
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        // notify all room users
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, joined room!` });
        // Send room data
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        // callback
        callback();

    });
    // events from frontend
    socket.on('sendMessage', (message, callback) => {
        // console.log("Message from frontend", message);
        const { user } = getUser(socket.id);
        // console.log('user', user);
        // console.log('current user room', user.room);
        if (user && user.room) {
            io.to(user.room).emit('message', { user: user.name, text: message });
            // Updated  room data
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left!` });
            
            // Updated  room data
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));
