import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import './normalize.css';
import './index.css';
import App from './App';
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
