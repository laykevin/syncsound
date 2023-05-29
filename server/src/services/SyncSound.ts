import http from 'http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEventHandler, IRoom, IUser, ServerToClientEventHandler } from 'shared';
import { Room } from '.';

interface SyncSoundConfig {
  httpServer: http.Server;
  port: number;
}

export class SyncSound {
  private _io: Server<ClientToServerEventHandler, ServerToClientEventHandler>;
  private _roomService: Room;

  constructor(config: SyncSoundConfig, room?: Room) {
    this._io = new Server(config.httpServer, {
      cors: {
        origin: [`http://localhost:${config.port}`],
      },
    });
    this._roomService = room ?? new Room();
  }

  public get io() {
    return this._io;
  }

  initialize = () => {
    this._io.on('connection', (socket) => {
      //fires when a new socket (user) is connected to this server
      console.log('SS.initialize:', socket.id);
      this.addSocketListeners(socket);
      this.addAdapterListeners();
    });
  };

  addSocketListeners = (socket: Socket<ClientToServerEventHandler, ServerToClientEventHandler>) => {
    socket.on('create-or-join-room', (roomName) => {
      if (!roomName) return console.warn('addSocketListeners: No room name');
      if (this._roomService.doesRoomExist(roomName)) this._roomService.joinRoom(roomName);
      else this._roomService.createRoom(roomName);
      socket.join(roomName);
    });

    socket.on('send-message', (message, roomName) => {
      // @ts-ignore
      socket.to(roomName).emit('receive-message', message);
    });

    // @ts-ignore
    socket.on('send-player', (videoData, roomName) => {
      // @ts-ignore
      socket.to(roomName).emit('receive-player', videoData);
    });
  };

  addAdapterListeners = () => {
    this._io.of('/').adapter.on('join-room', (roomName, socketId) => {
      if (this._roomService.doesRoomExist(roomName)) {
        this._io.to(roomName).emit('joined-room', this._roomService.getRoom(roomName));
        this._io.to(roomName).emit('receive-message', 'Someone has joined the room! ' + socketId);
      }
    });
  };
}
