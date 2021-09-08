const { PeerServer } = require('peer');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { Op, Sequelize } = require('sequelize');
const Room = require('../models/Room');
const User = require('../models/User');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
  ),
});

const app = require('../app');

const server = http.createServer(app);
// const server = http.Server(app);

// const io = socketIO(server);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

const roomIo = io.of('room');
const chatIo = io.of('chat');

const ports = {
  stuvel: 3000,
  peer: 3001,
};

app.set('port', ports.stuvel);

PeerServer({ port: ports.peer, path: '/' });

roomIo.on('connection', socket => {
  socket.on('join-room', async (roomId, userPeerId, userId) => {
    console.log('roomId', roomId, 'userPeerId', userPeerId, 'userId', userId);
    socket.join(roomId);
    User.update({ roomId }, { where: { id: userId } });
    const { joined_count: joinedCountConnected } = await Room.findOne({
      where: { id: roomId },
    });
    console.log('joinedCount = ', joinedCountConnected);
    Room.update(
      {
        joined_count: joinedCountConnected + 1,
      },
      { where: { id: roomId } },
    )
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    socket.to(roomId).emit('user-connected', userPeerId); // send a message to the all in the room except me
    socket.on('disconnect', async () => {
      User.update({ roomId: null }, { where: { id: userId } });
      const { joined_count: joinedCountDisconnected } = await Room.findOne({
        where: { id: roomId },
      });
      Room.update(
        {
          joined_count: joinedCountDisconnected - 1,
        },
        { where: { id: roomId } },
      );
      socket.to(roomId).emit('user-disconnected', userPeerId);
    });
  });
});

chatIo.on('connect', socket => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    chatIo.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
    return 0;
  });
});

const options = {
  host: '0.0.0.0',
  port: ports.stuvel,
};

server.listen(options, () => {
  console.log(options.port, '번 포트에서 대기중');
});
