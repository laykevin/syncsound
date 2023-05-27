import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const queryStringParams = new URLSearchParams(window.location.search);
const roomName = queryStringParams.get('room');

const $root = document.getElementById('root');
if ($root) {
  const root = ReactDOM.createRoot($root);
  root.render(
    <React.StrictMode>
      <App roomName={roomName} />
    </React.StrictMode>
  );
}
