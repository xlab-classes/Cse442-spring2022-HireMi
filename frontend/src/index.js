import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './normalize.css';
import './index.css';
import App from './App';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faAngleRight, faAngleLeft);

ReactDOM.render(
  <React.StrictMode>
      <Router basename='/CSE442-542/2022-Spring/cse-442r'>
      {/*<Router>*/}
          <App/>
      </Router>
  </React.StrictMode>,
  document.getElementById('root-hire-mi')
);
