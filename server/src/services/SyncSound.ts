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
      const userIndex = this._room.getUserIndexBySocketId(roomName, socket.id);
      if (room && userIndex) socket.emit(ToClientEvents.ssroomJoined, { room, userIndex });
      console.log(`ssroomCreateOrJoin: Room ${doesRoomExist ? 'joined' : 'created'}`);
    });

    socket.on(ToServerEvents.ssroomLeave, (roomName) => {
      if (!roomName) return console.warn('ssroomLeave: No room');
      const doesRoomExist = this._room.doesRoomExist(roomName);
      if (!doesRoomExist) return console.warn('ssroomLeave: Room not found');
      this._room.leaveRoom(roomName, socket.id);
      socket.leave(roomName);
      console.log('ssroomLeave:', roomName, socket.id);
    });

    socket.on('disconnecting', (reason) => {
      try {
        socket.rooms.forEach(socket.leave);
        console.log('socket-disconnecting:', reason);
      } catch (err) {
        //console.error('socket-disconnecting error:', err);
      }
    });

    socket.on(ToServerEvents.sschatSend, (message) => {
      if (!message) return console.warn('sschatSend: No message');
      socket.to(message.roomName).emit(ToClientEvents.sschatSent, message);
      console.log('sschatSend: Chat sent', message);
    });

    socket.on(ToServerEvents.ssuserChangeName, (data) => {
      if (!data) return console.warn('ssuserChangeName: No user name change data');
      const { roomName, username } = data;
      const room = this._room.getRoom(roomName);
      if (!room) return console.warn('ssuserChangeName: Room not found');
      const user = this._room.getUserBySocketId(roomName, socket.id);
      if (!user) return console.warn('ssuserChangeName: User not found');
      const previousName = user.username;
      user.username = username;
      const systemChat = this.createSystemChat(roomName, `${previousName} has changed their name to ${username}.`);
      this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      this._io.to(roomName).emit(ToClientEvents.ssuserNamedChanged, { room, previousName, newName: username });
    });

    socket.on(ToServerEvents.ssplaylistAdd, (sound) => {
      if (!sound) return console.warn('ssplaylistAdd: No sound');
      const room = this._room.getRoom(sound.roomName);
      if (!room) return console.warn('ssplaylistAdd: Room not found');
      room.playlist.push(sound);
      const systemChat = this.createSystemChat(
        sound.roomName,
        `${sound.addedBy} has queued the track ${sound.title2 ? sound.title2 : sound.title}!`
      );
      this._io.to(sound.roomName).emit(ToClientEvents.sschatSent, systemChat);
      this._io.to(sound.roomName).emit(ToClientEvents.ssplaylistAdded, room);
    });

    socket.on(ToServerEvents.ssplayerPlay, (data) => {
      if (!data) return console.warn('ssplayerPlay: No data');
      const { roomName, username } = data;
      const room = this._room.getRoom(roomName);
      if (!room) return console.warn('ssplayerPlay: Room not found');
      const systemChat = this.createSystemChat(roomName, username + ' has started playback.');
      this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      socket.to(roomName).emit(ToClientEvents.ssplayerPlayed);
    });

    socket.on(ToServerEvents.ssplayerPause, (data) => {
      if (!data) return console.warn('ssplayerPause: No data');
      const { roomName, username } = data;
      const room = this._room.getRoom(roomName);
      if (!room) return console.warn('ssplayerPause: Room not found');
      const systemChat = this.createSystemChat(roomName, username + ' has paused playback.');
      this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      socket.to(roomName).emit(ToClientEvents.ssplayerPaused);
    });
  };

  private addAdapterListeners = () => {
    console.log('SS.addAdapterListeners:', this._io.sockets.name);

    this._io.sockets.adapter.on('join-room', (roomName, socketId) => {
      if (!this._room.doesRoomExist(roomName)) return console.warn('adapter-join-room: Room not found');
      const room = this._room.getRoom(roomName);
      const user = this._room.getUserBySocketId(roomName, socketId);
      if (!room || !user) return console.warn('adapter-join-room: User not found');

      const systemChat = this.createSystemChat(roomName, (user.username || 'A user') + ' has joined the room!');
      this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      this._io.to(roomName).emit(ToClientEvents.ssroomUserJoined, room);
      console.log('adapter-join-room:', roomName, socketId);
    });

    this._io.sockets.adapter.on('leave-room', (roomName, socketId) => {
      if (!this._room.doesRoomExist(roomName)) return console.warn('adapter-leave-room: Room not found');
      const room = this._room.getRoom(roomName);
      const user = this._room.getUserBySocketId(roomName, socketId);
      if (!room || !user) return console.warn('adapter-leave-room: User not found');
      this._room.leaveRoom(roomName, socketId);

      const systemChat = this.createSystemChat(roomName, (user.username || 'A user') + ' has left the room.');
      this._io.to(roomName).emit(ToClientEvents.sschatSent, systemChat);
      this._io.to(roomName).emit(ToClientEvents.ssroomUserLeft, room);

      if (room.users.length <= 0) this._room.deleteRoom(roomName);
      console.log('adapter-leave-room:', roomName, socketId);
    });
  };

  private createSystemChat = (roomName: string, message: string): IChatMessage => {
    return { roomName, message, username: 'System' };
  };
}
