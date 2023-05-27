import React from 'react';
import { Room } from './Components/index';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:7000');
// socket.on('connect', () => {
//   displayMessage(`Connected with ${socket.id}`)
// })

const App: React.FC = () => {
  return (
    <>
      <div>Hello, World!</div>
      <Room />
    </>
  );
};
export default App;
