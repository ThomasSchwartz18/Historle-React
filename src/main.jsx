import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './assets/css/style.css';
import './assets/css/share.css';
import './assets/css/articles.css';
import './assets/css/landing.css';
import './assets/css/authPages.css';
import './assets/css/staticHomePage.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
