import { ClientToServerEvents, IChatMessage, IRoom, ServerToClientEvents } from 'shared';
import { Socket } from 'socket.io-client';

export interface IState {
  readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  readonly room: IRoom | null;
  readonly chatLog: Array<IChatMessage>;
}

export type MergeState = (nextState: Partial<IState>) => void;

export interface IStateContext {
  state: IState;
  setState: React.Dispatch<React.SetStateAction<IState>>;
  mergeState: MergeState;
}
