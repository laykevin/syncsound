import { Socket as ServerSocket } from 'socket.io';
import { IChatMessage, IRoom } from '.';

export enum ToServerEvents {
  //system
  'connection' = 'connection',
  'disconnect' = 'disconnect',
  'disconnecting' = 'disconnecting',
  'create-room' = 'create-room',
  'delete-room' = 'delete-room',
  'join-room' = 'join-room',
  'leave-room' = 'leave-room',
  //chat
  'send-message' = 'send-message',
  //room
  'create-or-join-room' = 'create-or-join-room',
}

export enum ToClientEvents {
  //system
  'connect' = 'connect',
  'disconnect' = 'disconnect',
  //chat
  'receive-message' = 'receive-message',
  //room
  'joined-room' = 'joined-room',
}

export interface PayloadMap {
  connection: ServerSocket;
  disconnect: string; //reason (duplicate event name in client)
  disconnecting: string; //reason
  'create-room': string; //room
  'delete-room': string; //room
  'join-room': string; //room, id (adapter will supply two args to handler)
  'leave-room': string; //room, id (adapter will supply two args to handler)
  'send-message': IChatMessage;
  'create-or-join-room': string;

  connect: undefined;
  'receive-message': string;
  'joined-room': IRoom;
}

export const IEvents = {
  ToServer: {
    System: {
      Server: { connection: ToServerEvents['connection'] },
      Socket: {
        disconnect: ToServerEvents['disconnect'],
        disconnecting: ToServerEvents['disconnecting'],
      },
      Adapter: {
        createRoom: ToServerEvents['create-room'],
        deleteRoom: ToServerEvents['delete-room'],
        joinRoom: ToServerEvents['join-room'],
        leaveRoom: ToServerEvents['leave-room'],
      },
    },
    Chat: { sendMessage: ToServerEvents['send-message'] },
    Room: { createOrJoinRoom: ToServerEvents['create-or-join-room'] },
  },
  ToClient: {
    System: {
      Socket: {
        connect: ToClientEvents['connect'],
        disconnect: ToClientEvents['disconnect'],
      },
    },
    Chat: { receiveMessage: ToClientEvents['receive-message'] },
    Room: { joinedRoom: ToClientEvents['joined-room'] },
  },
} as const;

export type ClientToServerEvent = keyof typeof ToServerEvents;
export type ClientToServerEventHandler = {
  [event in ClientToServerEvent]: (payload?: PayloadMap[event], callback?: Function) => void;
};

export type ServerToClientEvent = keyof typeof ToClientEvents;
export type ServerToClientEventHandler = {
  [event in ServerToClientEvent]: (payload?: PayloadMap[event], callback?: Function) => void;
};
// List of reserved event names: https://socket.io/docs/v4/emit-cheatsheet/#reserved-events
