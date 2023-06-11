import { ClientToServerEvents, IChatMessage, IRoom, ISound, IUser, ServerToClientEvents } from 'shared';
import { Socket } from 'socket.io-client';

export * from './State';
export * from './SyncSoundClient';

export interface IState {
  readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  readonly user: IUser | null;
  readonly room: IRoom | null;
  readonly chatLog: Array<IChatMessage>;
  readonly playlist: Array<ISound>;
}

export type MergeState = (nextState: Partial<IState>) => void;

export interface IStateContext {
  state: IState;
  setState: React.Dispatch<React.SetStateAction<IState>>;
  mergeState: MergeState;
}
