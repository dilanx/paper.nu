import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import SiteNotice from './components/menu/SiteNotice';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <SiteNotice />
  </React.StrictMode>
);
