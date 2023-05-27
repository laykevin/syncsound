import express from 'express';
import { IVideoData } from '../../client/src/components';

const io = require('socket.io')(7000, {
  cors: {
    origin: ['http://localhost:9000'],
  },
});

io.on('connection', (socket: any) => {
  console.log('Connected!', socket.id);
  socket.on('send-message', (message: string) => {
    socket.broadcast.emit('receive-message', message);
  });
  socket.on('send-player', (videoData: IVideoData) => {
    socket.broadcast.emit('receive-player', videoData);
    console.log(videoData);
  });
});

// const app = express();

// app.listen(8080, () => {
//   console.log('Listening on port 8080');
// });
