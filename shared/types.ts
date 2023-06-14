export interface IRoom {
  roomName: string;
  users: Array<IUser>;
  playlist: Array<ISound>;
}

export interface IUser {
  username: string;
  socketId: string;
  isHost: boolean;
  roomName: IRoom['roomName'];
}

export interface IChatMessage {
  roomName: IRoom['roomName'];
  username: IUser['username'] | 'System';
  message: string;
}

export enum SoundOrigin {
  YT = 'youtube',
  SC = 'soundcloud',
}

export interface ISound {
  src: string;
  title: string;
  origin: SoundOrigin;
  addedBy: IUser['username'];
  roomName: IRoom['roomName'];
}
