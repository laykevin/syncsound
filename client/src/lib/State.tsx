import React, { createContext, useCallback, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { IState, IStateContext } from '.';
import { ClientToServerEvents, ServerToClientEvents } from 'shared';

interface StateProviderProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  children: React.ReactNode;
}

export const StateContext = createContext<IStateContext>({
  state: {
    socket: io(),
    room: null,
    chatLog: [],
    playlist: [],
  },
  setState: () => {},
  mergeState: (nextState: Partial<IState>) => {
    return { room: null, chatLog: [], playlist: [], ...nextState };
  },
});

export const StateProvider: React.FC<StateProviderProps> = ({ socket, children }) => {
  const [state, setState] = useState<IState>({
    socket,
    room: null,
    chatLog: [],
    playlist: [],
  });

  const mergeState = useCallback((nextState: Partial<IState>) => {
    setState((prevState) => {
      return {
        ...prevState,
        ...nextState,
      };
    });
  }, []);

  return <StateContext.Provider value={{ state, setState, mergeState }}>{children}</StateContext.Provider>;
};
