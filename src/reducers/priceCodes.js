import { combineReducers } from 'redux';
import {
    CLEAR_ERROR, LOAD_LIST, LOAD_LIST_FAILURE, RECEIVE_LIST, RECEIVE_PRICELEVEL,
    SET_COMPANY, SET_PRICELEVEL, SET_PRICECODE, RECEIVE_PRICELEVEL_ITEMS, LOAD_PRICELEVEL_ITEMS,
    LOAD_PRICELEVEL_ITEMS_FAILURE,
    LOAD_PRICELEVEL, LOAD_PRICELEVEL_FAILURE, SAVE_PRICELEVEL_SUCCESS, SET_NEW_DISCOUNT_MARKUP,
    SAVE_PRICELEVEL, SAVE_PRICELEVEL_FAILURE, LOAD_PRICECODE_LEVELS, RECEIVE_PRICECODE_LEVELS,
    LOAD_PRICECODE_LEVELS_FAILURE,
    LOAD_PRICECODE_CHANGES_FAILURE, RECEIVE_PRICECODE_CHANGES, RECEIVE_PRICELEVEL_CHANGES, LOAD_PRICELEVELS_FAILURE,
    LOAD_PRICELEVELS, RECEIVE_PRICELEVELS, LOAD_PRICECODE_CHANGES
} from "../actions/priceCodes";

const company = (state = 'CHI', action) => {
    switch (action.type) {
    case SET_COMPANY:
        return action.company;
    default:
        return state;
    }
};

const list = (state = {}, action) => {
    switch (action.type) {
    case LOAD_LIST:
    case LOAD_LIST_FAILURE:
    case SET_COMPANY:
        return {};
    case RECEIVE_LIST:
        return Object.freeze({...action.list});
    default:
        return state;
    }
};

const levels = (state = {}, action) => {
    switch (action.type) {
    case LOAD_PRICELEVELS:
    case LOAD_PRICELEVELS_FAILURE:
        return {};
    case RECEIVE_PRICELEVELS:
        return action.levels;
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
    case RECEIVE_PRICECODE_CHANGES:
    case RECEIVE_PRICELEVEL_CHANGES:
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

const levelList = (state = {}, action) => {
    switch (action.type) {
    case LOAD_LIST:
    case LOAD_LIST_FAILURE:
        return {};

    case SET_PRICELEVEL:
        return {...action.prices};

    case RECEIVE_LIST:
    case RECEIVE_PRICELEVEL:
    case RECEIVE_PRICELEVEL_CHANGES:
        return Object.freeze({...action.prices});

    case SAVE_PRICELEVEL_SUCCESS:
    case SET_NEW_DISCOUNT_MARKUP:
        let levelList = {...state};
        levelList[action.priceCode.PriceCode] = action.priceCode;
        return {...levelList};
    default:
        return state;
    }
};

const errors = (state = [], action) => {
    const errors = [...state];
    switch (action.type) {
    case LOAD_PRICECODE_LEVELS_FAILURE:
    case LOAD_LIST_FAILURE:
    case LOAD_PRICELEVEL_ITEMS_FAILURE:
    case LOAD_PRICELEVEL_FAILURE:
    case SAVE_PRICELEVEL_FAILURE:
    case LOAD_PRICECODE_CHANGES_FAILURE:
        return [...errors, `${action.type}: ${action.message}`];

    case CLEAR_ERROR:
        return [...errors.filter((err, index) => index !== action.index)];

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
        return action.prices[state.PriceCode] || state;
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

const priceCodeLevels = (state = {}, action) => {
    const priceCodeLevels = {...state};
    switch (action.type) {
    case LOAD_PRICECODE_LEVELS:
    case LOAD_PRICECODE_LEVELS_FAILURE:
        return {};
    case RECEIVE_PRICECODE_LEVELS:
        Object.keys(action.levels).map(key => {
            const {newDiscountMarkup, UserName} = (priceCodeLevels[key] || {});
            priceCodeLevels[key] = {
                ...priceCodeLevels[key],
                ...action.levels[key],
                newDiscountMarkup,
                UserName
            };
        });
        return {...priceCodeLevels};
    case RECEIVE_PRICECODE_CHANGES:
        Object.keys(action.changes).map(key => {
            priceCodeLevels[key] = {
                ...priceCodeLevels[key],
                ...action.changes[key]
            };
        });
        return {...priceCodeLevels};
    case SAVE_PRICELEVEL_SUCCESS:
        const {priceCode} = action
        priceCodeLevels[priceCode.CustomerPriceLevel] = priceCode;
        return {...priceCodeLevels};
    default:
        return state;
    }
};

export default combineReducers({
    company,
    list,
    levels,
    loading,
    loadingItems,
    levelList,
    errors,
    priceLevel,
    selected,
    items,
    priceCodeLevels,
});
