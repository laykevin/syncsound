import { IChatMessage, IRoom, IRoomUser, ISound, IUser } from '.';
// List of reserved event names: https://socket.io/docs/v4/emit-cheatsheet/#reserved-events

export enum ToServerEvents {
  ssroomCreateOrJoin = 'ssroomCreateOrJoin',
  ssroomLeave = 'ssroomLeave',
  sschatSend = 'sschatSend',
  ssuserChangeName = 'ssuserChangeName',
  ssplaylistAdd = 'ssplaylistAdd',
  ssplayerPlay = 'ssplayerPlay',
  ssplayerPause = 'ssplayerPause',
}

export enum ToClientEvents {
  ssroomJoined = 'ssroomJoined',
  ssroomUserJoined = 'ssroomUserJoined',
  ssroomUserLeft = 'ssroomUserLeft',
  sschatSent = 'sschatSent',
  ssuserNamedChanged = 'ssuserNamedChanged',
  ssplaylistAdded = 'ssplaylistAdded',
  sshistoryAdded = 'sshistoryAdded',
  ssplayerReady = 'ssplayerReady',
  ssplayerPlayed = 'ssplayerPlayed',
  ssplayerPaused = 'ssplayerPaused',
}

export interface PayloadMap {
  //to server
  ssroomCreateOrJoin: string; //roomName
  ssroomLeave: string; //roomName
  sschatSend: IChatMessage;
  ssuserChangeName: IRoomUser;
  ssplaylistAdd: ISound;
  ssplayerPlay: IRoomUser;
  ssplayerPause: IRoomUser;
  //to client
  ssroomJoined: { room: IRoom; userIndex: number };
  ssroomUserJoined: IRoom;
  ssroomUserLeft: IRoom;
  sschatSent: IChatMessage;
  ssuserNamedChanged: { room: IRoom; previousName: string; newName: string };
  ssplaylistAdded: IRoom;
  sshistoryAdded: IRoom;
  ssplayerReady: undefined;
  ssplayerPlayed: undefined;
  ssplayerPaused: undefined;
}

export type ClientToServerEvents = {
  [event in keyof typeof ToServerEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};

export type ServerToClientEvents = {
  [event in keyof typeof ToClientEvents]: (payload?: PayloadMap[event], callback?: Function) => void;
};

export interface SCEvents {
  LOAD_PROGRESS: 'loadProgress';
  PLAY_PROGRESS: 'playProgress';
  PLAY: 'play';
  PAUSE: 'pause';
  FINISH: 'finish';
  SEEK: 'seek';
  READY: 'ready';
  CLICK_DOWNLOAD: 'downloadClicked';
  CLICK_BUY: 'buyClicked';
  OPEN_SHARE_PANEL: 'sharePanelOpened';
  ERROR: 'error';
}
