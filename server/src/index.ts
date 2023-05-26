import express from 'express';

const io = require('socket.io')(7000, {
  cors: {
    origin: ['http://localhost:9000'],
  },
});

io.on('connection', (socket: any) => {
  console.log('Connected!', socket.id);
  socket.on('custom-event', (a: any, b: any, c: any) => {
    console.log(a, b, c);
  });
});

// const app = express();

// app.listen(8080, () => {
//   console.log('Listening on port 8080');
// });
