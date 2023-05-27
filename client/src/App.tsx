import React from 'react';
import { Room, Player } from './components';
import { Start } from './pages';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:7000');
// socket.on('connect', () => {
//   displayMessage(`Connected with ${socket.id}`)
// })

const App: React.FC = () => {
  return (
    <>
      <Start />
      <Room />
      <Player />
    </>
  );
};
export default App;
