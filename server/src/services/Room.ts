import { IRoom, ISound, IUser } from 'shared';

export class Room {
  roomLookup: Record<string, IRoom>;

  constructor(roomLookup?: Record<string, IRoom>) {
    this.roomLookup = roomLookup ?? {};
  }

  doesRoomExist = (roomName: string): boolean => this.roomLookup[roomName] != null;

  getRoom = (roomName: string): IRoom | null => {
    if (!this.doesRoomExist(roomName)) {
      console.warn('Room.getRoom: Room does not exist');
      return null;
    }
    return this.roomLookup[roomName];
  };

  getNewUser = (socketId: string, isHost: boolean = false, username?: string): IUser => {
    if (!username) username = 'User' + Date.now().toString().slice(-5);
    console.log('Room.getNewUser', username, isHost);
    return { socketId, username, isHost };
  };

  createRoom = (roomName: string, socketId: string): void => {
    if (this.doesRoomExist(roomName)) return console.warn('Room.createRoom: Room already exists');
    this.roomLookup[roomName] = {
      roomName,
      users: [this.getNewUser(socketId, true)],
      playlist: [],
      history: [],
    };
    console.log('Room.createRoom:', this.roomLookup);
  };

  deleteRoom = (roomName: string): void => {
    if (!this.doesRoomExist(roomName)) return console.warn('Room.deleteRoom: Room does not exist');
    delete this.roomLookup[roomName];
    console.log('Room.deleteRoom:', this.roomLookup);
  };

  joinRoom = (roomName: string, socketId: string, user?: IUser): void => {
    if (!this.doesRoomExist(roomName)) return console.warn('Room.joinRoom: Room does not exist');
    if (!user) user = this.getNewUser(socketId);
    this.roomLookup[roomName].users.push(user);
    console.log('Room.joinRoom:', this.roomLookup, user);
  };

  leaveRoom = (roomName: string, socketId: string): void => {
    if (!this.doesRoomExist(roomName)) return console.warn('Room.leaveRoom: Room does not exist');
    const userIndex = this.roomLookup[roomName].users.findIndex((user) => user.socketId === socketId);
    if (userIndex < 0) return console.warn('Room.leaveRoom: User not found');
    this.roomLookup[roomName].users.splice(userIndex, 1);
    console.log('Room.leaveRoom:', this.roomLookup, socketId);
  };

  getUserBySocketId = (roomName: string, socketId: string): IUser | null => {
    if (!this.doesRoomExist(roomName)) {
      console.warn('Room.getUserBySocketId: Room does not exist');
      return null;
    }
    const userIndex = this.roomLookup[roomName].users.findIndex((user) => user.socketId === socketId);
    if (userIndex < 0) {
      console.warn('Room.getUserBySocketId: User not found');
      return null;
    }
    const user = this.roomLookup[roomName].users[userIndex];
    console.log('Room.getUserBySocketId:', this.roomLookup, user);
    return user;
  };

  getUserIndexBySocketId = (roomName: string, socketId: string): number | null => {
    if (!this.doesRoomExist(roomName)) {
      console.warn('Room.getUserIndexBySocketId: Room does not exist');
      return null;
    }
    const userIndex = this.roomLookup[roomName].users.findIndex((user) => user.socketId === socketId);
    if (userIndex < 0) {
      console.warn('Room.getUserIndexBySocketId: User not found');
      return null;
    }
    const user = this.roomLookup[roomName].users[userIndex];
    console.log('Room.getUserIndexBySocketId:', this.roomLookup, userIndex, user);
    return userIndex;
  };

  getCurrentTrack = (roomName: string): ISound | null => {
    if (!this.doesRoomExist(roomName)) {
      console.warn('Room.getCurrentTrack: Room does not exist');
      return null;
    }
    if (!this.roomLookup[roomName].playlist.length) {
      console.warn('Room.getCurrentTrack: No current track');
      return null;
    }
    const sound = this.roomLookup[roomName].playlist[0];
    console.log('Room.getCurrentTrack:', this.roomLookup, sound);
    return sound;
  };
}
