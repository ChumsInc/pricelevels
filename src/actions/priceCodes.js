import {fetchGET, fetchPOST, fetchDELETE} from '../chums/fetch';
import fetch from "../fetch";
import {fetchOptions} from "../utils";
import {
    LOAD_LIST,
    LOAD_LIST_FAILURE, LOAD_PRICECODE_CHANGES,
    LOAD_PRICECODE_CHANGES_FAILURE, LOAD_PRICECODE_LEVELS, LOAD_PRICECODE_LEVELS_FAILURE,
    LOAD_PRICELEVEL, LOAD_PRICELEVEL_CHANGES, LOAD_PRICELEVEL_CHANGES_FAILURE,
    LOAD_PRICELEVEL_FAILURE,
    LOAD_PRICELEVEL_ITEMS,
    LOAD_PRICELEVEL_ITEMS_FAILURE,
    LOAD_PRICELEVELS, LOAD_PRICELEVELS_FAILURE,
    RECEIVE_LIST,
    RECEIVE_PRICECODE_CHANGES, RECEIVE_PRICECODE_LEVELS,
    RECEIVE_PRICELEVEL, RECEIVE_PRICELEVEL_CHANGES,
    RECEIVE_PRICELEVEL_ITEMS,
    RECEIVE_PRICELEVELS, SAVE_PRICELEVEL, SAVE_PRICELEVEL_FAILURE, SAVE_PRICELEVEL_SUCCESS,
    SET_NEW_DISCOUNT_MARKUP,
    SET_PRICECODE,
    SET_PRICELEVEL
} from "../constants/App";

const defaultPriceCode = {
    PriceCodeRecord: '0',
    PriceCode: '',
    CustomerPriceLevel: '',
    PriceCodeDesc: '',
    PricingMethod: 'D',
    BreakQuantity1: 99999999,
    DiscountMarkup1: 0,
    newDiscountMarkup: null,
};


const shouldFetchPriceCodes = (state) => {
    return Object.keys(state.priceCodes.list).length === 0 && state.priceCodes.loading === false;
};
const loadPriceCodes = () => ({type: LOAD_LIST});
const loadPriceCodesFailure = (err) => ({type: LOAD_LIST_FAILURE, message: err.message});
const receivePriceCodes = (list, prices) => ({type: RECEIVE_LIST, list, prices});


const loadPriceLevel = () => ({type: LOAD_PRICELEVEL});
const loadPriceLevelFailure = (err) => ({type: LOAD_PRICELEVEL_FAILURE, message: err.message});
const receivePriceLevel = (prices) => ({type: RECEIVE_PRICELEVEL, prices});

export const setPriceCode = (priceCode) => ({type: SET_PRICECODE, priceCode});
export const loadItems = () => ({type: LOAD_PRICELEVEL_ITEMS});
export const loadItemsFailure = (err) => ({type: LOAD_PRICELEVEL_ITEMS_FAILURE, message: err.message});
export const receiveItems = (items) => ({type: RECEIVE_PRICELEVEL_ITEMS, items});

export const setPriceLevel = (level) => (dispatch, getState) => {
    const {priceCodes} = getState();
    dispatch({type: SET_PRICELEVEL, level, prices: priceCodes.list});
};

export const setNewDiscountMarkup = (newDiscountMarkup) => (dispatch, getState) => {
    const {priceCodes} = getState();
    dispatch({type:SET_NEW_DISCOUNT_MARKUP, priceCode: {...priceCodes.selected, newDiscountMarkup}});
    dispatch(savePriceLevel());
};

export const setNewPriceCodeLevelsDiscount = (newDiscountMarkup, priceLevel) => (dispatch, getState) => {
    const {priceCodes} = getState();
    const {priceCodeLevels} = priceCodes;
    if (!priceCodeLevels[priceLevel]) {
        priceCodeLevels[priceLevel] = {
            ...defaultPriceCode,
            PriceCode: priceCodes.selected.PriceCode,
            PriceCodeDesc: priceCodes.selected.PriceCodeDesc,
            CustomerPriceLevel: priceLevel,
        }
    }
    priceCodeLevels[priceLevel].newDiscountMarkup = newDiscountMarkup;
    priceCodeLevels[priceLevel].changed = true;

    dispatch({type: SET_NEW_DISCOUNT_MARKUP, levels: priceCodeLevels, priceCode: priceCodeLevels[priceLevel]});
};

export const fetchPriceLevels = () => (dispatch, getState) => {
    dispatch({type: LOAD_PRICELEVELS});
    const {company} = getState();
    const url = '/node/sales/pricing/:Company/pricelevels'
        .replace(':Company', encodeURIComponent(company));
    fetchGET(url)
        .then(res => {
            const levels = {};
            res.result
                .map(lvl => {
                    levels[lvl.PriceLevel] = lvl;
                });
            dispatch({type: RECEIVE_PRICELEVELS, levels});
        })
        .catch(err => {
            dispatch({type: LOAD_PRICELEVELS_FAILURE, message: err.message});
        });
};

export const fetchPriceCodes = () => (dispatch, getState) => {
    const state = getState();
    if (shouldFetchPriceCodes(state)) {

        const {company} = state;

        dispatch(loadPriceCodes());
        dispatch(fetchPriceLevels());

        const url = '/node-sage/api/:Company/pricing/pricecodes'
            .replace(':Company', encodeURIComponent(company));
        fetchGET(url)
            .then(res => {
                const priceCodes = {};

                (res.result || []).map(pc => {
                    priceCodes[pc.PriceCode] = {
                        ...defaultPriceCode,
                        ...pc,
                    };
                });
                const prices = {...priceCodes};
                dispatch(receivePriceCodes(priceCodes, prices));
            })
            .catch(err => {
                dispatch(loadPriceCodesFailure(err));
            });
    }
};

export const fetchPriceLevel = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    const url = '/node-sage/api/:Company/pricing/pricelevel/:PriceLevel'
        .replace(':Company', encodeURIComponent(company))
        .replace(':PriceLevel', encodeURIComponent(priceCodes.priceLevel));
    dispatch(loadPriceLevel());
    fetchGET(url)
        .then(res => {
            const levels = res.result || [];
            const {priceCodes} = getState();
            const prices = {...priceCodes.list};

            levels.map(l => {
                prices[l.PriceCode] = {
                    ...l,
                    newDiscountMarkup: null,
                    UserName: null,
                }
            });
            dispatch(receivePriceLevel(prices));
            dispatch(fetchPriceLevelChanges());
        })
        .catch(err => {
            dispatch(loadPriceLevelFailure(err));
        })
};

export const fetchItems = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    if (!priceCodes.selected) {
        return;
    }
    dispatch(loadItems());
    const url = '/node-sage/api/:Company/pricing/pricecode/:PriceCode/items'
        .replace(/:Company/g, encodeURIComponent(company))
        .replace(/:PriceCode/g, encodeURIComponent(priceCodes.selected.PriceCode));

    fetchGET(url)
        .then(res => {
            dispatch(receiveItems(res.result));
        })
        .catch(err => {
            dispatch(loadItemsFailure(err));
        })
};

export const selectPriceCode = (priceCode) => (dispatch) => {
    dispatch(setPriceCode(priceCode));
    dispatch(fetchItems());
    dispatch(fetchPriceLevelChanges());
    dispatch(fetchPriceCodeLevels());
    dispatch(fetchPriceCodeChanges());
};


export const fetchPriceLevelChanges = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    if (!priceCodes.priceLevel) {
        return;
    }
    const url = '/node/sales/pricing/:Company/:PriceLevel'
        .replace(':Company', encodeURIComponent(company))
        .replace(':PriceLevel', encodeURIComponent(priceCodes.priceLevel));
    dispatch({type: LOAD_PRICELEVEL_CHANGES});
    fetchGET(url)
        .then(res => {
            const levels = res.result || [];
            const {priceCodes} = getState();
            const prices = {...priceCodes.levelList};

            levels.forEach(l => {
                const {DiscountMarkup1, UserName, ...props} = l;
                prices[l.PriceCode] = {...props, DiscountMarkup1: prices[l.PriceCode].DiscountMarkup1};
                prices[l.PriceCode].newDiscountMarkup = DiscountMarkup1;
                prices[l.PriceCode].UserName = UserName;
            });
            dispatch({type: RECEIVE_PRICELEVEL_CHANGES, prices})
        })
        .catch(err => {
            dispatch({type: LOAD_PRICELEVEL_CHANGES_FAILURE, message: err.message});
        });
};

export const fetchPriceCodeChanges = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    if (!priceCodes.selected) {
        return;
    }
    const url = '/node/sales/pricing/:Company/pricecode/:PriceCode'
        .replace(':Company', encodeURIComponent(company))
        .replace(':PriceCode', encodeURIComponent(priceCodes.selected.PriceCode));

    dispatch({type: LOAD_PRICECODE_CHANGES});
    fetchGET(url)
        .then(res => {
            const changes = {};
            res.result.map(pc => {
                const {DiscountMarkup1, ...props} = pc;
                changes[pc.CustomerPriceLevel] = {...props, newDiscountMarkup: DiscountMarkup1};
            });
            dispatch({type: RECEIVE_PRICECODE_CHANGES, changes});
        })
        .catch(err => {
            dispatch({type: LOAD_PRICECODE_CHANGES_FAILURE, message: err.message});
        });
};

export const savePriceLevel = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    const {selected} = priceCodes;
    if (!selected || !selected.CustomerPriceLevel) {
        return;
    }
    const url = '/node/sales/pricing/:Company'
            .replace(':Company', encodeURIComponent(company));

    if (selected.newDiscountMarkup === '' || selected.newDiscountMarkup === selected.DiscountMarkup1) {
        dispatch(deletePriceLevel());
        return;
    }
    dispatch({type: SAVE_PRICELEVEL});
    fetchPOST(url, selected)
        .then(res => {
            dispatch({type: SAVE_PRICELEVEL_SUCCESS, priceCode: selected});
        })
        .catch(err => {
            console.log(err);
            dispatch({type: SAVE_PRICELEVEL_FAILURE, message: err.message});
        });
};

export const deletePriceLevel = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    const {selected} = priceCodes;
    if (!selected || !selected.CustomerPriceLevel) {
        return;
    }
    const url = '/node/sales/pricing/:Company/:PriceCode/:PriceLevel'
        .replace(':Company', encodeURIComponent(company))
        .replace(':PriceCode', encodeURIComponent(selected.PriceCode))
        .replace(':PriceLevel', encodeURIComponent(selected.CustomerPriceLevel));

    dispatch({type: SAVE_PRICELEVEL});
    fetchDELETE(url)
        .then(res => {
            dispatch({type: SAVE_PRICELEVEL_SUCCESS, priceCode: {...selected, newDiscountMarkup: null, UserName: ''}});
        })
        .catch(err => {
            console.log(err);
            dispatch({type: SAVE_PRICELEVEL_FAILURE, message: err.message});
        });
};


export const fetchPriceCodeLevels = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();

    if (!priceCodes.selected) {
        return;
    }

    const url = '/node-sage/api/:Company/pricing/pricecode/:PriceCode/levels'
        .replace(/:Company/g, encodeURIComponent(company))
        .replace(/:PriceCode/g, encodeURIComponent(priceCodes.selected.PriceCode));
    dispatch({type: LOAD_PRICECODE_LEVELS});
    fetchGET(url)
        .then(res => {
            const levels = {};
            res.result
                .filter(level => level.CustomerPriceLevel !== null)
                .map(level => {
                    levels[level.CustomerPriceLevel] = {...level, newDiscountMarkup: null};
                });
            dispatch({type: RECEIVE_PRICECODE_LEVELS, levels});
        })
        .catch(err => {
            console.log(err.message, err);
            dispatch({type: LOAD_PRICECODE_LEVELS_FAILURE, message: err.message});
        });
};

export const savePriceCodeChanges = () => (dispatch, getState) => {
    const {priceCodes, company} = getState();
    const {priceCodeLevels} = priceCodes;

    const url = '/node/sales/pricing/:Company'
        .replace(':Company', encodeURIComponent(company));

    Object.keys(priceCodeLevels)
        .map(key => priceCodeLevels[key])
        .filter(level => level.changed)
        .map(level => {
            if (level.DiscountMarkup1 === level.newDiscountMarkup || level.newDiscountMarkup === '') {
                const url = '/node/sales/pricing/:Company/:PriceCode/:PriceLevel'
                    .replace(':Company', encodeURIComponent(company))
                    .replace(':PriceCode', encodeURIComponent(level.PriceCode))
                    .replace(':PriceLevel', encodeURIComponent(level.CustomerPriceLevel));
                fetchDELETE(url)
                    .then(res => {
                        const priceCode = {
                            ...level,
                            newDiscountMarkup: null,
                            UserName: '',
                            changed: false
                        };
                        dispatch({type: SAVE_PRICELEVEL_SUCCESS, priceCode});
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch({type: SAVE_PRICELEVEL_FAILURE, message: err.message});
                    });
            } else {
                fetchPOST(url, level)
                    .then(res => {
                        const priceCode = {
                            ...level,
                            changed: false
                        };
                        dispatch({type: SAVE_PRICELEVEL_SUCCESS, priceCode});
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch({type: SAVE_PRICELEVEL_FAILURE, message: err.message});
                    });
            }
        });
};
