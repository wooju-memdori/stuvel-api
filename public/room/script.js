const socket = io('/room');

const videoGrid = document.getElementById('video-grid');

// let server to generate own client id
const myPeer = new Peer();

const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {};

// navigator: 현재 머무르고 있는 브라우저의 정보를 얻을 수 있는 엘리먼트
// navigator.mediaDevices: 카메라, 마이크, 화면공유와 같이 현재 연결된 미디어 입력 장치에 접근할 수 있는 MediaDevice객체 반환
navigator.mediaDevices
  // 사용자에게 입력장치 사용권한을 요청, 사용자가 수락하면 요청한 미디어 종류의 트랙을 포함한 MediaStream객체 반환
  // MediaStream 객체로 이행하는 Promise
  .getUserMedia({
    video: true,
    audio: true,
  })
  // stream 사용
  .then(stream => {
    addVideoStream(myVideo, stream);

    // receive the call
    myPeer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
    });
  });

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
});

// when connect to peer server and get back id, emit this id and room id
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
});

// make the call when the new user connect to our room
function connectToNewUser(userId, stream) {
  // call to the user with this userId and give stream to that user
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  // and when they send back their stream,
  // we're gonna get the event called stream
  // userVideoStream: add to the list of the video
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  // whenever someone leaves the room remove their video
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  // HTMLMediaElement.srcObject : MediaStream
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}
