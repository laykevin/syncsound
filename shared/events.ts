import { IChatMessage, IRoom, IUser } from '.';
// List of reserved event names: https://socket.io/docs/v4/emit-cheatsheet/#reserved-events

export enum ToServerEvents {
  sschatSend = 'sschatSend',
  ssroomCreateOrJoin = 'ssroomCreateOrJoin',
  ssroomLeave = 'ssroomLeave',
}

export enum ToClientEvents {
  sschatSent = 'sschatSent',
  ssroomJoined = 'ssroomJoined',
  ssroomLeft = 'ssroomLeft',
}

export interface PayloadMap {
  //to server
  sschatSend: IChatMessage;
  ssroomCreateOrJoin: string; //roomName
  ssroomLeave: IUser;
  //to client
  sschatSent: IChatMessage;
  ssroomJoined: IRoom;
  ssroomLeft: IRoom;
}

export type ClientToServerEvents = {
  [event in keyof typeof ToServerEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};

export type ServerToClientEvents = {
  [event in keyof typeof ToClientEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};
