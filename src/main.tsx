import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';
import { initDB } from './utils/indexedDB';


// First, initialize the database.
initDB()
  .then((success) => {
    if (success) {
      console.log("Database initialized successfully.");
      // ONLY AFTER the DB is ready, render the React application.
      ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
    } else {
      throw new Error("Database initialization failed.");
    }
  })
  .catch(error => {
    console.error("Failed to initialize database. The application cannot start.", error);
    // You could render a user-friendly error message to the page here
    document.getElementById('root')!.innerHTML =
      `<div style="text-align: center; padding: 50px; font-family: sans-serif;">
        <h1>Application Error</h1>
        <p>Could not connect to the local database. Please try clearing your site data and refreshing the page.</p>
      </div>`;
  });