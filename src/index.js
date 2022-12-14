import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router} from "react-router-dom";
import Auth0ProviderWithHistory from './auth/src/auth/auth0-provider-with-history';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CalendarContextProvider } from './contexts/CalendarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithHistory>
        <CalendarContextProvider>
            <App />
        </CalendarContextProvider>
      </Auth0ProviderWithHistory>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
