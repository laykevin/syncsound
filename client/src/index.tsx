import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { StateProvider, SyncSoundClient } from './lib';

const queryStringParams = new URLSearchParams(window.location.search);
const roomName = queryStringParams.get('room');
const client = new SyncSoundClient();

const $root = document.getElementById('root');
if ($root) {
  ReactDOM.createRoot($root).render(
    <StateProvider socket={client.socket}>
      <App roomName={roomName} initialize={client.initialize} disconnect={client.disconnect} />
    </StateProvider>
  );
} else {
  console.error('App failed to launch...');
}
