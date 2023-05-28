import React from 'react';
import { Room, Player } from './components';
import { Start } from './pages';

interface AppProps {
  roomName: string | null;
}

const App: React.FC<AppProps> = ({ roomName }) => {
  if (roomName)
    return (
      <>
        <Room roomName={roomName} />
        <Player />
      </>
    );
  return <Start />;
};
export default App;
