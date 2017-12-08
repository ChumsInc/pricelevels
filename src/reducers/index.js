import { combineReducers } from 'redux';
import priceCodes from './priceCodes';
import priceLevels from './priceLevels';

import {TABS, SET_TAB} from '../constants/App';
import {getTab} from "../actions/AppActions";

const tab = (state = getTab(), action) => {
    switch (action.type) {
    case SET_TAB:
        return action.tab;
    default:
        return state;
    }
};

const app = combineReducers({
    tab,
    priceCodes,
    // priceLevels,
});

export default app;
