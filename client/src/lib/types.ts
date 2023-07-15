import { ClientToServerEvents, IChatMessage, IRoom, ServerToClientEvents } from 'shared';
import { Socket } from 'socket.io-client';
import { PlayerController } from '.';

export interface IState {
  readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  readonly room: IRoom | null;
  readonly chatLog: Array<IChatMessage>;
  readonly player: PlayerController | null;
  readonly playerStatus: { isPlaying: boolean; shouldEmit: boolean };
}

export type MergeState = (nextState: Partial<IState>) => void;

export interface IStateContext {
  state: IState;
  setState: React.Dispatch<React.SetStateAction<IState>>;
  mergeState: MergeState;
}
