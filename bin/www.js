const { PeerServer } = require('peer');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
  ),
});

const app = require('../app');

const port = 3000;
app.set('port', port);

const server = http.createServer(app);
// const server = http.Server(app);


// const io = socketIO(server);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

const options = {
  host: '0.0.0.0',
  port: 3000,
};

const room = io.of('room');

const port = {
  stuvel: 3000,
  peer: 3001,
};

app.set('port', port.stuvel);

PeerServer({ port: port.peer, path: '/' });

room.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log('roomId', roomId, 'userId', userId);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId); // send a message to the all in the room except me

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});


server.listen(options, () => {
  console.log(port.stuvel, '번 포트에서 대기중');
  
});
