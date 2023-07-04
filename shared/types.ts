export interface IRoom {
  roomName: string;
  users: Array<IUser>;
  playlist: Array<ISound>;
  history: Array<ISound>;
}

export interface IUser {
  username: string;
  socketId: string;
  isHost: boolean;
}

export interface ISound {
  src: string;
  title: string;
  origin: SoundOrigin;
  addedBy: IUser['username'];
  roomName: IRoom['roomName'];
}

export enum SoundOrigin {
  YT = 'youtube',
  SC = 'soundcloud',
}

export interface IChatMessage {
  roomName: IRoom['roomName'];
  username: IUser['username'] | 'System';
  message: string;
}
