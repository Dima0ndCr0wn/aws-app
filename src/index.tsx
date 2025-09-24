import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { getCLS, getFCP, getLCP } from 'web-vitals';
// getTTFB ya no se exporta directamente, debes usar PerformanceObserver si la necesitas


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function sendToAnalytics(metric: any) {
  console.log('Web Vital:', metric);
}

// getCLS(sendToAnalytics);
// getFID(sendToAnalytics);
// getFCP(sendToAnalytics);
// getLCP(sendToAnalytics);
// getTTFB(sendToAnalytics);