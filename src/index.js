import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import logger from './utils/logger';

logger.info('Bootstrap', 'Application bootstrap started');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
