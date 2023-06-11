import { Socket, io } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents, ToClientEvents } from 'shared';
import { IStateContext } from '.';

export class SyncSoundClient {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('socket-connect:', this.socket.id);
    });
  }

  public initialize = (context: IStateContext): void => {
    console.log('SSClient.initialize');
    if (!context) return console.error('No state context provided');

    this.socket.onAny((event: string, ...payload: any[]) => {
      console.log('Event received:', this.socket.id, event, payload);
      if (!event.startsWith('ss')) {
        console.warn(`Event "${event}" not recognized as a valid SyncSound event`);
      }
    });

    this.addListeners(context);
  };

  private addListeners = (context: IStateContext): void => {
    this.socket.on(ToClientEvents.sschatSent, (message) => {
      if (!message) return console.warn('sschatSent: No message');
      const chatLog = [...context.state.chatLog, message];
      context.mergeState({ chatLog });
    });

    this.socket.on(ToClientEvents.ssroomJoined, (room) => {
      if (!room) return console.warn('ssroomJoined: No room');
      context.mergeState({ room });
    });

    this.socket.on(ToClientEvents.ssroomLeft, (room) => {
      if (!room) return console.warn('ssroomLeft: No room');
      context.mergeState({ room: null });
    });
  };

  public disconnect = (): void => {
    const disconnectedSocket = this.socket.disconnect();
    console.log('SSClient.disconnect:', disconnectedSocket);
  };
}
