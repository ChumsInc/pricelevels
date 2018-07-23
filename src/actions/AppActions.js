
import {
    CLEAR_ERROR,
    SET_COMPANY,
    RECEIVE_USERS,
    SET_ERROR,
    SET_TAB,
    TABS,
    RECEIVE_CHANGE_LIST,
    SET_USER
} from '../constants/App';
import {fetchGET} from '../chums/fetch';
import {fetchPriceCodes} from "./priceCodes";

const appStorage = window.localStorage;
const STORAGE_KEYS = {
    TAB: 'com.chums.intranet.pricelevels.tab',
};

export const setCompany = (company) => (dispatch, getState) => {
    const state = getState();
    if (!company) {
        company = state.company;
    }
    dispatch({type: SET_COMPANY, company});
    dispatch(fetchPriceCodes());
    dispatch(fetchUserList());
};

export const clearError = (index) => ({type: CLEAR_ERROR, index});
export const setUser = (user) => ({type: SET_USER, user});

export const setTab = (tab, employeeFilter) => {
    if (!tab) {
        tab = appStorage.getItem(STORAGE_KEYS.TAB) || TABS.PRICE_CODES.key;
    }
    appStorage.setItem(STORAGE_KEYS.TAB, tab);
    return {type: SET_TAB, tab}
};

export const getTab = () => {
    const tab = appStorage.getItem(STORAGE_KEYS.TAB);
    if (!tab || !TABS[tab]) {
        return TABS.PRICE_CODES.key;
    }
    return tab;
};

export const fetchChanges = () => (dispatch, getState) => {
    const {company, user} = getState();
    const url = '/node-dev/sales/pricing/:Company/changes/:UserName'
        .replace(':Company', company)
        .replace(':UserName', user);
    fetchGET(url)
        .then(list => {
            dispatch({type: RECEIVE_CHANGE_LIST, list});
        })
        .catch(err => {
            dispatch({type: SET_ERROR, message: err.message});
        })
};

export const fetchUserList = () => (dispatch, getState) => {
    const {company} = getState();
    const url = '/node-dev/sales/pricing/:Company/changes/'
        .replace(':Company', company);
    fetchGET(url)
        .then(response => {
            const users = response.map(row => row.UserName);
            dispatch({type: RECEIVE_USERS, users});
        })
        .catch(err => {
            dispatch({type: SET_ERROR, message: err.message});
        });
};
