
import {SET_TAB, TABS} from '../constants/App';

const appStorage = window.localStorage;
const STORAGE_KEYS = {
    TAB: 'com.chums.intranet.pricelevels.tab',
};

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

