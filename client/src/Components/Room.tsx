import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// const socket = io('http://localhost:7000');
// socket.on('connect', () => {
//   displayMessage(`Connected with ${socket.id}`);
// });
const socket = io('http://localhost:7000');
export const Room: React.FC = () => {
  const [embedCodesList, setEmbedCodesList] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      setEmbedCodesList((prevEmbedCodesList) => [...prevEmbedCodesList, `Connected with id:${socket.id}`]);
      socket.on('receive-message', (message: string) => {
        setEmbedCodesList((prevEmbedCodesList) => [...prevEmbedCodesList, message]);
      });
    });
  }, []);

  // socket.on('receive-message', (message: string) => {
  //   setEmbedCodesList((prevEmbedCodesList) => [...prevEmbedCodesList, message]);
  // });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const $embedInput = document.getElementById('embed-input') as HTMLInputElement;
    const embedCode = $embedInput.value;
    if (embedCode) {
      setEmbedCodesList((prevEmbedCodesList) => [...prevEmbedCodesList, embedCode]);
      socket.emit('send-message', $embedInput.value);
      $embedInput.value = '';
    }
  };

  return (
    <>
      <div id="message-container">
        <ul>
          {embedCodesList.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <form id="form" onSubmit={handleSubmit}>
        <label htmlFor="embed-input">Embed Code</label>
        <input type="text" id="embed-input"></input>
        <button type="submit">Add</button>
      </form>
    </>
  );
};
