import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, StateProvider, SyncSoundClient } from './lib';
import { Start } from './pages';

const queryStringParams = new URLSearchParams(window.location.search);
const roomName = queryStringParams.get('room');
const $root = document.getElementById('root');

const initialize = (rootEl: HTMLElement | null, roomName: string | null): void => {
  if (!rootEl) return console.error('App failed to launch...');
  const reactRoot = ReactDOM.createRoot(rootEl);
  if (!roomName) return reactRoot.render(<Start />);
  const client = new SyncSoundClient();
  reactRoot.render(
    <StateProvider socket={client.socket}>
      <App roomName={roomName} initialize={client.initialize} disconnect={client.disconnect} />
    </StateProvider>
  );
  // @ts-ignore
  window.ssclient = client;
};

initialize($root, roomName);
console.log('Launching SyncSound');
