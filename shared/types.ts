export interface IUser {
  username: string;
  isHost: boolean;
}

export interface IRoom {
  roomName: string;
  users: Array<IUser>;
}

export interface IChatMessage {
  username: string;
  message: string;
}
