import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import App from './App';
/* import {Error} from './Error' */
import './css/index.css';

/*
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
*/

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App} />
  </Router>
), document.getElementById('root'));
