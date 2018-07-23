import { combineReducers } from 'redux';
import {
    CLEAR_ERROR, LOAD_LIST, LOAD_LIST_FAILURE, RECEIVE_LIST, RECEIVE_PRICELEVEL,
    SET_COMPANY, SET_PRICELEVEL, SET_PRICECODE, RECEIVE_PRICELEVEL_ITEMS, LOAD_PRICELEVEL_ITEMS,
    LOAD_PRICELEVEL_ITEMS_FAILURE,
    LOAD_PRICELEVEL, LOAD_PRICELEVEL_FAILURE, SAVE_PRICELEVEL_SUCCESS, SET_NEW_DISCOUNT_MARKUP,
    SAVE_PRICELEVEL, SAVE_PRICELEVEL_FAILURE, LOAD_PRICECODE_LEVELS, RECEIVE_PRICECODE_LEVELS,
    LOAD_PRICECODE_LEVELS_FAILURE, RECEIVE_NEW_PRICECODE_DISCOUNTS, RECEIVE_NEW_PRICELEVEL_DISCOUNTS
} from "../constants/App";

const list = (state = [], action) => {
    switch (action.type) {
    case LOAD_LIST:
    case LOAD_LIST_FAILURE:
    case SET_COMPANY:
        return [];
    case RECEIVE_LIST:
        return action.list;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    switch (action.type) {
    case LOAD_LIST:
    case LOAD_PRICELEVEL:
        return true;
    case LOAD_LIST_FAILURE:
    case LOAD_PRICELEVEL_FAILURE:
    case RECEIVE_LIST:
    case RECEIVE_PRICELEVEL:
    case RECEIVE_NEW_PRICECODE_DISCOUNTS:
    case RECEIVE_NEW_PRICELEVEL_DISCOUNTS:
        return false;
    default:
        return state;
    }
};

const loadingItems = (state = false, action) => {
    switch (action.type) {
    case LOAD_PRICELEVEL_ITEMS:
    case SAVE_PRICELEVEL:
        return true;
    case SAVE_PRICELEVEL_SUCCESS:
    case SAVE_PRICELEVEL_FAILURE:
    case LOAD_PRICELEVEL_ITEMS_FAILURE:
    case RECEIVE_PRICELEVEL_ITEMS:
        return false;
    default:
        return state;
    }
};

const levelList = (state = [], action) => {
    switch (action.type) {
    case LOAD_LIST:
    case LOAD_LIST_FAILURE:
        return [];

    case RECEIVE_LIST:
    case RECEIVE_PRICELEVEL:
    case RECEIVE_NEW_PRICELEVEL_DISCOUNTS:
        return action.prices.sort((a, b) => a.PriceCode === b.PriceCode ? 0 : (a.PriceCode > b.PriceCode ? 1 : -1));

    case SAVE_PRICELEVEL_SUCCESS:
    case SET_NEW_DISCOUNT_MARKUP:
        return [
            ...state
                .filter(priceCode => priceCode.PriceCode === action.priceCode.PriceCode)
                .map(() => action.priceCode),
            ...state
                .filter(priceCode => priceCode.PriceCode !== action.priceCode.PriceCode)
        ].sort((a, b) => a.PriceCode === b.PriceCode ? 0 : (a.PriceCode > b.PriceCode ? 1 : -1));

    default:
        return state;
    }
};

const priceLevel = (state = '', action) => {
    switch (action.type) {
    case SET_PRICELEVEL:
        return action.level;
    default:
        return state;
    }
};

const selected = (state = null, action) => {
    switch (action.type) {
    case SET_PRICECODE:
    case SAVE_PRICELEVEL_SUCCESS:
    case SET_NEW_DISCOUNT_MARKUP:
        return {...action.priceCode};
    case SET_PRICELEVEL:
        if (state === null) {
            return state;
        }
        return {...state, CustomerPriceLevel: action.level};
    case RECEIVE_PRICELEVEL:
        if (state === null) {
            return state;
        }
        let found = {};
        action.prices
            .filter(price => price.PriceCode === state.PriceCode)
            .map(price => {
                found = price;
            });
        return {...state, ...found};
    default:
        return state;
    }
};

const items = (state = [], action) => {
    switch (action.type) {
    case RECEIVE_PRICELEVEL_ITEMS:
        return action.items;
    case LOAD_PRICELEVEL_ITEMS:
    case LOAD_PRICELEVEL_ITEMS_FAILURE:
        return [];
    default:
        return state;
    }
};

const priceCodeLevels = (state = [], action) => {
    switch (action.type) {
    case LOAD_PRICECODE_LEVELS:
    case LOAD_PRICECODE_LEVELS_FAILURE:
        return [];
    case RECEIVE_PRICECODE_LEVELS:
        return {...action.levels};
    default:
        return state;
    }
};

export default combineReducers({
    list,
    loading,
    loadingItems,
    levelList,
    priceLevel,
    selected,
    items,
    priceCodeLevels,
});
