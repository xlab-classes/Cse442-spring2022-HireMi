import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import './normalize.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faAngleRight, faAngleLeft);

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <App/>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root-hire-mi')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
