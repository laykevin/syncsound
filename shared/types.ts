export interface IRoom {
  roomName: string;
  users: Array<IUser>;
}

export interface IUser {
  username: string;
  socketId: string;
  isHost: boolean;
  readonly roomName: IRoom['roomName'];
}

export interface IChatMessage {
  roomName: string;
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
}
