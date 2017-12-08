/**
 * Created by steve on 8/23/16.
 */

import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home';
import styles from './style.css';

window.CHUMS = Object.assign(window.CHUMS || {}, {react: true});
render(
    <Home />,
    document.getElementById('app')
);


