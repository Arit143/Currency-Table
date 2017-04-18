'use strict';
require('./site/style.css');

const React = require('react');
const ReactDOM = require('react-dom');

import CurrencyTable from './site/jsx/index.js';

ReactDOM.render(<CurrencyTable />, document.getElementById('app'));

