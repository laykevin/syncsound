import { Socket, io } from 'socket.io-client';
import { ClientToServerEvents, IRoom, IUser, ServerToClientEvents, ToClientEvents, ToServerEvents } from 'shared';
import { IState, IStateContext } from '..';

export class SocketController {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('socket-connect:', this.socket.id);
    });
  }

  public static getCurrentUser(state: IState): IUser | null {
    const { room, socket } = state;
    const user = room?.users.find((user) => user.socketId === socket.id);
    if (!user) {
      console.warn('SSClient.getCurrentUser: No user found');
      return null;
    }
    return user;
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
      if (!payload?.userIndex) return console.warn('ssroomJoined: No user index');
      context.mergeState({ ...payload });
    });

    this.socket.on(ToClientEvents.ssroomUserJoined, (room) => {
      if (!room) return console.warn('ssroomUserJoined: No room');
      context.mergeState({ room });
    });

    this.socket.on(ToClientEvents.ssroomUserLeft, (room) => {
      if (!room) return console.warn('ssroomUserLeft: No room');
      context.mergeState({ room });
    });

    this.socket.on(ToClientEvents.ssuserNamedChanged, (nameChangeData) => {
      if (!nameChangeData) return console.warn('ssuserNamedChanged: No name change data');
      const { room, previousName, newName } = nameChangeData;
      context.setState((prev) => {
        const chatLog = prev.chatLog.map((chat) => {
          if (chat.username === previousName) {
            return {
              ...chat,
              username: newName,
            };
          }
          return chat;
        });
        return {
          ...prev,
          room,
          chatLog,
        };
      });
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
