import { IChatMessage, IRoom, ISound } from '.';
// List of reserved event names: https://socket.io/docs/v4/emit-cheatsheet/#reserved-events

export enum ToServerEvents {
  ssroomCreateOrJoin = 'ssroomCreateOrJoin',
  ssroomLeave = 'ssroomLeave',
  sschatSend = 'sschatSend',
  ssuserChangeName = 'ssuserChangeName',
  ssplaylistAdd = 'ssplaylistAdd',
}

export enum ToClientEvents {
  ssroomJoined = 'ssroomJoined',
  ssroomUserJoined = 'ssroomUserJoined',
  ssroomUserLeft = 'ssroomUserLeft',
  sschatSent = 'sschatSent',
  ssuserNamedChanged = 'ssuserNamedChanged',
  ssplaylistAdded = 'ssplaylistAdded',
}

export interface PayloadMap {
  //to server
  ssroomCreateOrJoin: string; //roomName
  ssroomLeave: string; //roomName
  sschatSend: IChatMessage;
  ssuserChangeName: { roomName: string; newName: string };
  ssplaylistAdd: ISound;
  //to client
  ssroomJoined: { room: IRoom; userIndex: number };
  ssroomUserJoined: IRoom;
  ssroomUserLeft: IRoom;
  sschatSent: IChatMessage;
  ssuserNamedChanged: { room: IRoom; previousName: string; newName: string };
  ssplaylistAdded: IRoom;
}

export type ClientToServerEvents = {
  [event in keyof typeof ToServerEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};

export type ServerToClientEvents = {
  [event in keyof typeof ToClientEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};
