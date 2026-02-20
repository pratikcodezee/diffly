import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Google Analytics (optional - set REACT_APP_GA_MEASUREMENT_ID to enable)
const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
if (gaId) {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

