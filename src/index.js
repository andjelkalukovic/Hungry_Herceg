import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const transitions = {
  FADE: 'fade',
  SCALE: 'scale'
}
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  transition: transitions.SCALE
}
ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </AlertProvider>
  
  ,
  document.getElementById('root')
);

