import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const $root = document.getElementById('root');
if ($root) {
  const root = ReactDOM.createRoot($root);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
