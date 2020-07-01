import './style/index.css'
import './style/leS.less'
// import './style/bunld.scss'


import React from 'react';
import {render} from 'react-dom';
import Hello from './hello.jsx'; // 可省略.js后缀名

render(<Hello/>, document.getElementById('root'));
