const { PeerServer } = require('peer');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { Op, Sequelize } = require('sequelize');
const Room = require('../models/Room');
const User = require('../models/User');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./chatUsers');

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
  socket.on('join-room', async (roomId, userPeerId, userInfo) => {
    console.log(
      'roomId',
      roomId,
      'userPeerId',
      userPeerId,
      'userInfo',
      userInfo,
    );
    const userId = userInfo.id;
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
    socket.to(roomId).emit('user-connected', userPeerId, userInfo); // send a message to the all in the room except me
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

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    const timeSent = new Date();

    /* eslint-disable */
    chatIo.to(user.room).emit('message', {
      user: user.name,
      text: message,
      time: `${('0' + timeSent.getHours()).slice(-2)}:${(
        '0' + timeSent.getMinutes()
      ).slice(-2)}`,
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      chatIo.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const options = {
  host: '0.0.0.0',
  port: ports.stuvel,
};

server.listen(options, () => {
  console.log(options.port, '??? ???????????? ?????????');
});
