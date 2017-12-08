/**
 * Created by steve on 2/9/2017.
 */
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
