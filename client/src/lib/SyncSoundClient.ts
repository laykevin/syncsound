import { Socket, io } from 'socket.io-client';
import { ClientToServerEvents, IRoom, ServerToClientEvents, ToClientEvents, ToServerEvents } from 'shared';
import { IStateContext } from '.';

export class SyncSoundClient {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('socket-connect:', this.socket.id);
    });
  }

  public initialize = (context: IStateContext, roomName: string): void => {
    console.log('SSClient.initialize');
    if (!context) return console.error('No state context provided');

    this.socket.onAny((event: string, ...payload: any[]) => {
      console.log('Event received:', this.socket.id, event, ...payload);
      if (!event.startsWith('ss')) {
        console.warn(`Event "${event}" not recognized as a valid SyncSound event`);
      }
    });

    this.addListeners(context);

    this.socket.emit(ToServerEvents.ssroomCreateOrJoin, roomName, (room: IRoom) => context.mergeState({ room }));
  };

  private addListeners = (context: IStateContext): void => {
    this.socket.on(ToClientEvents.sschatSent, (message) => {
      if (!message) return console.warn('sschatSent: No message');
      context.setState((prev) => {
        console.log('sschatSent: Updating chat log', prev, context.state);
        return { ...prev, chatLog: [...prev.chatLog, message] };
      });
    });

    this.socket.on(ToClientEvents.ssroomJoined, (payload) => {
      if (!payload?.room) return console.warn('ssroomJoined: No room');
      if (!payload?.user) return console.warn('ssroomJoined: No user');
      context.mergeState({ ...payload });
    });

    this.socket.on(ToClientEvents.ssroomUserJoined, (room) => {
      if (!room) return console.warn('ssroomUserJoined: No room');
      console.log('Join ConsoleLog');
      context.mergeState({ room });
    });
    //Kevin Change
    // this.socket.on(ToClientEvents.ssroomChangedName, (payload) => {
    //   if (!payload?.room) return console.warn('ssroomChangedName: No room');
    //   if (!payload?.user) return console.warn('ssroomChangedName: No user');
    //   context.mergeState({ ...payload });
    // });

    this.socket.on(ToClientEvents.ssroomUserChangedName, (room) => {
      if (!room) return console.warn('ssroomUserChangedName: No room');
      console.log('KEVINS console room', room);
      console.log('change name?', room);
      context.mergeState({ room });
    });

    this.socket.on(ToClientEvents.ssroomLeft, (payload) => {
      if (!payload?.room) return console.warn('ssroomLeft: No room');
      if (!payload?.user) return console.warn('ssroomLeft: No user');
      context.mergeState({ ...payload });
    });

    this.socket.on(ToClientEvents.ssroomUserLeft, (room) => {
      if (!room) return console.warn('ssroomUserLeft: No room');
      context.mergeState({ room });
    });

    this.socket.on(ToClientEvents.ssplaylistAdded, (room) => {
      if (!room) return console.warn('ssroomAdded: No room');
      context.mergeState({ room });
    });
  };

  public disconnect = (): void => {
    const disconnectedSocket = this.socket.disconnect();
    console.log('SSClient.disconnect:', disconnectedSocket);
  };
}
