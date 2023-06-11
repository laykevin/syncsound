import React, { useContext, useEffect } from 'react';
import { Room, Player } from './components';
import { Start } from './pages';
import { IStateContext, StateContext } from './lib';

interface AppProps {
  roomName: string | null;
  initialize: (context: IStateContext) => void;
  disconnect: () => void;
}

export const App: React.FC<AppProps> = ({ roomName, initialize, disconnect }) => {
  const stateContext = useContext(StateContext);

  useEffect(() => {
    initialize(stateContext);
    return disconnect;
  }, []);

  if (roomName)
    return (
      <>
        <Room roomName={roomName} />
        <Player />
      </>
    );
  return <Start />;
};
