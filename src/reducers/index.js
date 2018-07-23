import { combineReducers } from 'redux';
import priceCodes from './priceCodes';
import priceLevels from './priceLevels';

import {getTab} from "../actions/AppActions";
import {
    TABS, SET_TAB, RECEIVE_CHANGE_LIST, SET_ERROR, DISMISS_ERROR, RECEIVE_USERS,
    CLEAR_ERROR,
    LOAD_LIST_FAILURE, LOAD_PRICECODE_CHANGES_FAILURE,
    LOAD_PRICECODE_LEVELS_FAILURE,
    LOAD_PRICELEVEL_FAILURE, LOAD_PRICELEVEL_ITEMS_FAILURE,
    SAVE_PRICELEVEL_FAILURE, SET_COMPANY, SET_USER
} from "../constants/App";

const errors = (state = [], action) => {
    const errors = [...state];
    switch (action.type) {
    case LOAD_PRICECODE_LEVELS_FAILURE:
    case LOAD_LIST_FAILURE:
    case LOAD_PRICELEVEL_ITEMS_FAILURE:
    case LOAD_PRICELEVEL_FAILURE:
    case SAVE_PRICELEVEL_FAILURE:
    case LOAD_PRICECODE_CHANGES_FAILURE:
    case SET_ERROR:
        return [...errors, `${action.type}: ${action.message}`];

    case CLEAR_ERROR:
        return [...errors.filter((err, index) => index !== action.index)];

    default:
        return state;
    }
};

const tab = (state = getTab(), action) => {
    switch (action.type) {
    case SET_TAB:
        return action.tab;
    default:
        return state;
    }
};


const company = (state = 'CHI', action) => {
    switch (action.type) {
    case SET_COMPANY:
        return action.company;
    default:
        return state;
    }
};

const users = (state = [], action) => {
    switch(action.type) {
    case RECEIVE_USERS:
        return action.users;
    default:
        return state;
    }
};

const user = (state = '', action) => {
    switch (action.type) {
    case SET_USER:
        return action.user;
    default:
        return state;
    }
};

const changes = (state = [], action) => {
    const {type, list} = action;
    switch (type) {
    case RECEIVE_CHANGE_LIST:
        return [...list];
    default:
        return state;
    }
};

const app = combineReducers({
    errors,
    tab,
    company,
    priceCodes,
    changes,
    users,
    user,
});


export default app;
