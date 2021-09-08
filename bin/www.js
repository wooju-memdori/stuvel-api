const { PeerServer } = require('peer');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { Op, Sequelize } = require('sequelize');
const Room = require('../models/Room');
const User = require('../models/User');

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

const room = io.of('room');

const ports = {
  stuvel: 3000,
  peer: 3001,
};

app.set('port', ports.stuvel);

PeerServer({ port: ports.peer, path: '/' });

room.on('connection', socket => {
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

const options = {
  host: '0.0.0.0',
  port: ports.stuvel,
};

server.listen(options, () => {
  console.log(options.port, '번 포트에서 대기중');
});
