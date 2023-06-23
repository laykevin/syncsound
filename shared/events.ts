import { IChatMessage, IRoom, ISound, IUser } from '.';
// List of reserved event names: https://socket.io/docs/v4/emit-cheatsheet/#reserved-events

export enum ToServerEvents {
  ssroomCreateOrJoin = 'ssroomCreateOrJoin',
  ssroomUserNameChange = 'ssroomUserNameChange',
  ssroomLeave = 'ssroomLeave',
  sschatSend = 'sschatSend',
  ssplaylistAdd = 'ssplaylistAdd',
}

export enum ToClientEvents {
  ssroomJoined = 'ssroomJoined',
  ssroomUserJoined = 'ssroomUserJoined',
  ssroomUserChangedName = 'ssroomUserChangedName', //Kevin Change
  ssroomLeft = 'ssroomLeft',
  ssroomUserLeft = 'ssroomUserLeft',
  sschatSent = 'sschatSent',
  ssplaylistAdded = 'ssplaylistAdded',
}

export interface PayloadMap {
  //to server
  ssroomCreateOrJoin: string; //roomName
  ssroomUserNameChange: IRoom; //Kevin Changed
  ssroomLeave: IUser;
  sschatSend: IChatMessage;
  ssplaylistAdd: ISound;
  //to client
  ssroomJoined: { room: IRoom; user: IUser };
  ssroomUserJoined: IRoom;
  ssroomUserChangedName: IRoom; //Kevin Change
  ssroomLeft: { room: IRoom; user: IUser };
  ssroomUserLeft: IRoom;
  sschatSent: IChatMessage;
  ssplaylistAdded: IRoom;
}

export type ClientToServerEvents = {
  [event in keyof typeof ToServerEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};

export type ServerToClientEvents = {
  [event in keyof typeof ToClientEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};
