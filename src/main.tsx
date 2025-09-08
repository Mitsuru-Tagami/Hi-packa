import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import i18next from './i18n'; // i18next インスタンスをインポート
import { I18nextProvider } from 'react-i18next';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);