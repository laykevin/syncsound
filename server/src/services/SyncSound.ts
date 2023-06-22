import http from 'http';
import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  IChatMessage,
  IUser,
  ServerToClientEvents,
  ToClientEvents,
  ToServerEvents,
} from 'shared';
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
        //console.error('socket-disconnecting error:', err);
      }
    });
    //Kevin Changed
    socket.on(ToServerEvents.ssroomUserNameChange, (changedUserName) => {
      if (!changedUserName) return console.warn('ssroomUserNameChange: No name');
      const room = this._room.getRoom(changedUserName.roomName);
      const socketId = this._room.getUserBySocketId(changedUserName.roomName, socket.id);
      if (!room) return console.warn('ssplaylistAdd: Room not found');
      const findUserIndex = (user: IUser) => user.socketId === socketId?.socketId;
      const userIndex = room?.users.findIndex(findUserIndex);
      room.users[userIndex].username = changedUserName.users[userIndex].username;
      socket.to(changedUserName.roomName).emit(ToClientEvents.ssroomUserChangedName, changedUserName);
      console.log('ssroomUserNameChange', changedUserName);
      console.log('WHAT IS ROOM', room);
      console.log('WHAT IS SOCKETID', socketId);
    });

    socket.on(ToServerEvents.sschatSend, (message) => {
      if (!message) return console.warn('sschatSend: No message');
      socket.to(message.roomName).emit(ToClientEvents.sschatSent, message);
      console.log('sschatSend: Chat sent', message);
    });

    socket.on(ToServerEvents.ssplaylistAdd, (sound) => {
      if (!sound) return console.warn('ssplaylistAdd: No sound');
      const room = this._room.getRoom(sound.roomName);
      if (!room) return console.warn('ssplaylistAdd: Room not found');
      room.playlist.push(sound);
      socket.to(sound.roomName).emit(ToClientEvents.ssplaylistAdded, room);
      console.log('ssplaylistAdd: Sound added', sound);
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
      if (!room || !user) return console.warn('adapter-leave-room: User not found');

      this._io.to(roomName).emit(ToClientEvents.ssroomUserLeft, room);
      this._room.leaveRoom(roomName, user.username);
      const systemChat = this.createSystemChat(roomName, (user.username || 'A user') + ' has left the room.');
      this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);

      if (room.users.length <= 0) this._room.deleteRoom(roomName);
      console.log('adapter-leave-room:', roomName, socketId);
    });
  };

  private createSystemChat = (roomName: string, message: string): IChatMessage => {
    return { roomName, message, username: 'System' };
  };
}
