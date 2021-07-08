import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import AppNew from './AppNew';

//eactDOM.render(<Router><App/></Router>, document.getElementById('root'));
ReactDOM.render(<Router><AppNew/></Router>, document.getElementById('root')); //new one making incremental progress on

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
