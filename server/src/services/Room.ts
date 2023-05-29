import { IRoom, IUser } from 'shared';

export class Room {
  roomLookup: Record<string, IRoom>;

  constructor(roomLookup?: Record<string, IRoom>) {
    this.roomLookup = roomLookup ?? {};
  }

  doesRoomExist = (roomName: string): boolean => this.roomLookup[roomName] != null;

  getRoom = (roomName: string): IRoom | undefined => {
    if (!this.doesRoomExist(roomName)) console.warn('Room.getRoom: Room does not exist');
    return this.roomLookup[roomName];
  };

  getNewUser = (username?: string, isHost: boolean = false): IUser => {
    if (!username) username = 'User' + Date.now().toString().slice(-5);
    console.log('Room.getNewUser', username, isHost);
    return { username, isHost };
  };

  createRoom = (roomName: string, hostName?: string): void => {
    if (this.doesRoomExist(roomName)) return console.warn('Room.createRoom: Room already exists');
    this.roomLookup[roomName] = { roomName, users: [this.getNewUser(hostName, true)] };
    console.log('Room.createRoom:', this.roomLookup);
  };

  deleteRoom = (roomName: string): void => {
    if (!this.doesRoomExist(roomName)) return console.warn('Room.deleteRoom: Room does not exist');
    delete this.roomLookup[roomName];
    console.log('Room.deleteRoom:', this.roomLookup);
  };

  joinRoom = (roomName: string, user?: IUser): void => {
    if (!this.doesRoomExist(roomName)) return console.warn('Room.joinRoom: Room does not exist');
    if (!user) user = this.getNewUser();
    this.roomLookup[roomName].users.push(user);
    console.log('Room.joinRoom:', this.roomLookup, user);
  };

  leaveRoom = (roomName: string, username: string): void => {
    if (!this.doesRoomExist(roomName)) return console.warn('Room.leaveRoom: Room does not exist');
    const userIndex = this.roomLookup[roomName].users.findIndex((user) => user.username === username);
    if (userIndex < 0) return;
    this.roomLookup[roomName].users.splice(userIndex, 1);
    console.log('Room.leaveRoom:', this.roomLookup, username);
  };
}
