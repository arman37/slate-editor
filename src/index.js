/**
 * @author arman
 * @since 8/20/18
 *
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

const title = 'A custom document editor ';

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('app')
);

module.hot.accept();
