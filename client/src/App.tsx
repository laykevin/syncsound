import React from 'react';
import { Room, Player } from './components';
import { Start } from './pages';

interface AppProps {
  roomName: string | null;
}

const App: React.FC<AppProps> = () => {
  return (
    <>
      <Start />
      <Room />
      <Player />
    </>
  );
};
export default App;
