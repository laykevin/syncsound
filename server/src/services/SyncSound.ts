import http from 'http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, IChatMessage, ServerToClientEvents, ToClientEvents, ToServerEvents } from 'shared';
import { Room } from '.';

interface SyncSoundConfig {
  httpServer: http.Server;
  port: number;
}

export class SyncSound {
  private _io: Server<ClientToServerEvents, ServerToClientEvents>;
  private _room: Room;

  constructor(config: SyncSoundConfig, room?: Room) {
    this._io = new Server(config.httpServer, {
      cors: {
        origin: [`http://localhost:${config.port}`],
      },
    });
    this._room = room ?? new Room();
  }

  public get io() {
    return this._io;
  }

  public initialize = () => {
    console.log('SS.initialize:', this._io.sockets.name);
    this._io.on('connection', (socket) => {
      //fires when a new socket (user) is connected to this server
      console.log('io-connection:', socket.id);
      this.addSocketListeners(socket);
    });
    this.addAdapterListeners();
  };

  private addSocketListeners = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('SS.addSocketListeners:', socket.id);

    socket.on(ToServerEvents.ssroomCreateOrJoin, (roomName) => {
      if (!roomName) return console.warn('ssroomCreateOrJoin: No room name');

      const doesRoomExist = this._room.doesRoomExist(roomName);
      if (doesRoomExist) this._room.joinRoom(roomName, socket.id);
      else this._room.createRoom(roomName, socket.id);
      socket.join(roomName);

      const room = this._room.getRoom(roomName);
      const user = this._room.getUserBySocketId(roomName, socket.id);
      if (room && user) socket.emit(ToClientEvents.ssroomJoined, { room, user });
      console.log(`ssroomCreateOrJoin: Room ${doesRoomExist ? 'joined' : 'created'}`);
    });

    socket.on(ToServerEvents.ssroomLeave, (user) => {
      if (!user) return console.warn('ssroomLeave: No user');
      const doesRoomExist = this._room.doesRoomExist(user.roomName);
      if (!doesRoomExist) return console.warn('ssroomLeave: Room not found');
      this._room.leaveRoom(user.roomName, user.username);
      socket.leave(user.roomName);

      const room = this._room.getRoom(user.roomName);
      if (room) socket.emit(ToClientEvents.ssroomLeft, { room, user });
      console.log('ssroomLeave:', user);
    });

    socket.on('disconnecting', (reason) => {
      try {
        socket.rooms.forEach(socket.leave);
        console.log('socket-disconnecting:', reason);
      } catch (err) {
        console.error('socket-disconnecting error:', err);
      }
    });

    socket.on(ToServerEvents.sschatSend, (message) => {
      if (!message) return console.warn('sschatSend: No message');
      socket.to(message.roomName).emit(ToClientEvents.sschatSent, message);
      console.log('sschatSend: Chat sent', message);
    });

    // @ts-ignore
    socket.on('send-player', (videoData, roomName) => {
      // @ts-ignore
      socket.to(roomName).emit('receive-player', videoData);
    });
  };

  private addAdapterListeners = () => {
    console.log('SS.addAdapterListeners:', this._io.sockets.name);

    this._io.sockets.adapter.on('join-room', (roomName, socketId) => {
      if (!this._room.doesRoomExist(roomName)) return console.warn('adapter-join-room: Room not found');

      const room = this._room.getRoom(roomName);
      const user = this._room.getUserBySocketId(roomName, socketId);
      if (room && user) {
        this._io.to(roomName).emit(ToClientEvents.ssroomUserJoined, room);
        const systemChat = this.createSystemChat(roomName, (user.username || 'A user') + ' has joined the room!');
        this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      }

      console.log('adapter-join-room:', roomName, socketId);
    });

    this._io.sockets.adapter.on('leave-room', (roomName, socketId) => {
      if (!this._room.doesRoomExist(roomName)) return console.warn('adapter-leave-room: Room not found');

      const room = this._room.getRoom(roomName);
      const user = this._room.getUserBySocketId(roomName, socketId);
      if (room && user) {
        this._io.to(roomName).emit(ToClientEvents.ssroomUserLeft, room);
        this._room.leaveRoom(roomName, user.username);
        const systemChat = this.createSystemChat(roomName, (user.username || 'A user') + ' has left the room.');
        this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      }

      console.log('adapter-leave-room:', roomName, socketId);
    });
  };

  private createSystemChat = (roomName: string, message: string): IChatMessage => {
    return { roomName, message, username: 'System' };
  };
}
