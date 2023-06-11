import React, { useContext, useEffect } from 'react';
import { Room, Start } from './pages';
import { IStateContext, StateContext } from './lib';

interface AppProps {
  roomName: string | null;
  initialize: (context: IStateContext, roomName: string) => void;
  disconnect: () => void;
}

export const App: React.FC<AppProps> = ({ roomName, initialize, disconnect }) => {
  const stateContext = useContext(StateContext);

  useEffect(() => {
    if (roomName) initialize(stateContext, roomName);
    return disconnect;
  }, []);

  if (roomName) return <Room roomName={roomName} />;
  return <Start />;
};
