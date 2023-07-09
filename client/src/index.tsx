import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, StateProvider, SocketController } from './lib';
import { Start } from './pages';
import { ToClientEvents } from 'shared';

window.onYouTubeIframeAPIReady = function (): void {
  const event = new Event(ToClientEvents.ssplayerReady);
  document.dispatchEvent(event);
  console.log('onYouTubeIframeAPIReady', event, YT);
};

const queryStringParams = new URLSearchParams(window.location.search);
const roomName = queryStringParams.get('room');
const $root = document.getElementById('root');

const initialize = (rootEl: HTMLElement | null, roomName: string | null): void => {
  if (!rootEl) return console.error('App failed to launch...');
  const reactRoot = ReactDOM.createRoot(rootEl);
  if (!roomName) return reactRoot.render(<Start />);
  const client = new SocketController();
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
