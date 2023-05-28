import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
const path = require('path');
import { IVideoData } from '../../client/src/components';

const PORT = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [`http://localhost:${PORT}`],
  },
});

const outputDir = path.join(__dirname, '../../client/dist');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(outputDir));

// type IRoom = { room: string }
// const rooms: IRoom = {} as IRoom;
const rooms: any = {};

app.get('/', (req, res) => {
  console.log('from get /');
  res.sendFile(path.join(outputDir, 'index.html'));
});

// app.post('/room', (req: Request<{},{},IRoom>, res: Response) => {
app.post('/room', (req, res) => {
  console.log('from post /room', req.body);
  if (rooms[req.body.room] == null) {
    rooms[req.body.room] = { users: {} };
  }
  res.redirect(req.body.room);
  // Send message that new room was created
  io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
  console.log('from get /:rooms', rooms);
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  res.redirect('/' + '?room=' + req.params.room);
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

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
