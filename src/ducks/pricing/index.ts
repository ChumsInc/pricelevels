import {createReducer} from '@reduxjs/toolkit'
import {PriceLevelVisibilityList, PricingState} from "./types";
import {priceCodeKey} from "./utils";
import {
    deletePriceCodeChange,
    loadPriceChangeUsers,
    loadPriceCodes,
    loadPriceLevels,
    setCurrentUser,
    saveCurrentPriceLevel,
    savePriceCode,
    savePriceLevelSort,
    setCurrentPriceCode,
    setCurrentPriceLevel,
    setPriceCodeLevelDiscount,
    updatePriceLevel, setPLVisibility
} from "./actions";
import {SessionStore} from 'chums-components';
import {sessionStorageVisibilityKey} from "../../constants";

export * from './actions';
export * from './selectors';


const pricingState: PricingState = {
    priceCodes: {
        list: {},
        loading: "idle",
        loaded: false,
        current: {
            loading: 'idle',
            items: [],
            priceCode: null,
            levels: {}
        }
    },
    priceLevels: {
        list: {},
        loading: 'idle',
        loaded: false,
        current: {
            loading: 'idle',
            priceLevel: null,
            customers: [],
            priceCodes: {},
        }
    },
    changes: {
        users: [],
        changes: [],
        currentUser: null,
        loading: 'idle'
    }
}

export const priceCodesTableKey = 'price-codes';


const reducer = createReducer(pricingState, (builder) => {
    builder
        .addCase(loadPriceLevels.pending, (state) => {
            state.priceLevels.loading = "pending";
        })
        .addCase(loadPriceLevels.rejected, (state) => {
            state.priceLevels.loading = "failed";
        })
        .addCase(loadPriceLevels.fulfilled, (state, action) => {
            state.priceLevels.list = action.payload.list;
            state.priceLevels.loading = "succeeded";
            state.priceLevels.loaded = true;
        })

        .addCase(savePriceLevelSort.pending, (state) => {
            state.priceLevels.loading = "pending";
        })
        .addCase(savePriceLevelSort.rejected, (state) => {
            state.priceLevels.loading = "failed";
        })
        .addCase(savePriceLevelSort.fulfilled, (state, action) => {
            state.priceLevels.list = action.payload.list;
            state.priceLevels.loading = "succeeded";
            state.priceLevels.loaded = true;
        })


        .addCase(setCurrentPriceLevel.pending, (state, action) => {
            state.priceLevels.current.loading = "pending";
            if (state.priceLevels.current.priceLevel?.PriceLevel !== action.meta.arg?.PriceLevel) {
                state.priceLevels.current.customers = [];
            }
            state.priceLevels.current.priceLevel = action.meta.arg || null;
        })
        .addCase(setCurrentPriceLevel.rejected, (state, action) => {
            state.priceLevels.current.loading = 'failed';
        })
        .addCase(setCurrentPriceLevel.fulfilled, (state, action) => {
            state.priceLevels.current.loading = 'succeeded';
            // state.priceCodes.list = action.payload.list;
            state.priceLevels.current.customers = action.payload.customers;
            state.priceLevels.current.priceCodes = action.payload.list;
            if (state.priceCodes.current.priceCode) {
                const priceCode = action.payload.list[state.priceCodes.current.priceCode.PriceCode];
                state.priceCodes.current.priceCode = priceCode || null;
            }
        })

        .addCase(saveCurrentPriceLevel.pending, (state, action) => {
            state.priceLevels.current.loading = "pending";
        })
        .addCase(saveCurrentPriceLevel.rejected, (state, action) => {
            state.priceLevels.current.loading = "failed";
        })
        .addCase(saveCurrentPriceLevel.fulfilled, (state, action) => {
            state.priceLevels.current.loading = "succeeded";
            state.priceCodes.list = action.payload.list;
            state.priceLevels.current.customers = action.payload.customers;
            if (state.priceCodes.current.priceCode) {
                const priceCode = action.payload.list[state.priceCodes.current.priceCode.PriceCode];
                state.priceCodes.current.priceCode = priceCode || null;
            }
        })

        .addCase(updatePriceLevel, (state, action) => {
            if (!state.priceLevels.current.priceLevel) {
                return;
            }
            state.priceLevels.current.priceLevel = {
                ...state.priceLevels.current.priceLevel, ...action.payload,
                changed: true
            };
        })

        .addCase(loadPriceCodes.pending, (state) => {
            state.priceCodes.loading = "pending";
        })
        .addCase(loadPriceCodes.rejected, (state) => {
            state.priceCodes.loading = "failed";
        })
        .addCase(loadPriceCodes.fulfilled, (state, action) => {
            state.priceCodes.list = action.payload.list;
            state.priceCodes.loading = "succeeded";
            state.priceCodes.loaded = true;
            if (state.priceCodes.current.priceCode) {
                if (state.priceCodes.list[state.priceCodes.current.priceCode.PriceCode]) {
                    state.priceCodes.current.priceCode = state.priceCodes.list[state.priceCodes.current.priceCode.PriceCode];
                } else {
                    state.priceCodes.current.priceCode = null;
                    state.priceCodes.current.items = [];
                }
            }
            if (!state.priceLevels.current.priceLevel) {
                // state.priceLevels.selected.priceCodes = action.payload.priceCodes.map(pc => ({...pc, CustomerPriceLevel: ''}));
            }
        })

        .addCase(setCurrentPriceCode.pending, (state, action) => {
            state.priceCodes.current.loading = "pending";
            if (action.meta.arg?.PriceCode !== state.priceCodes.current.priceCode?.PriceCode) {
                state.priceCodes.current.levels = {};
                state.priceCodes.current.items = [];
            }
            state.priceCodes.current.priceCode = !!action.meta.arg ? {
                ...action.meta.arg,
                CustomerPriceLevel: state.priceLevels.current?.priceLevel?.PriceLevel ?? ''
            } : null;
        })
        .addCase(setCurrentPriceCode.rejected, (state, action) => {
            state.priceCodes.current.loading = "failed";
        })
        .addCase(setCurrentPriceCode.fulfilled, (state, action) => {
            state.priceCodes.current.loading = "succeeded";
            // state.priceCodes.selected.priceCodes = action.payload.pricing;
            state.priceCodes.current.items = action.payload.items;
            state.priceCodes.current.levels = action.payload.levels;
        })

        .addCase(setPriceCodeLevelDiscount, (state, action) => {
            const {level, discount} = action.payload;
            if (state.priceCodes.current.priceCode?.CustomerPriceLevel === level) {
                if (discount === state.priceCodes.current.priceCode.DiscountMarkup1) {
                    state.priceCodes.current.priceCode.changed = discount !== state.priceCodes.current.priceCode.newDiscountMarkup1;
                    state.priceCodes.current.priceCode.newDiscountMarkup1 = undefined;
                } else {
                    state.priceCodes.current.priceCode.newDiscountMarkup1 = discount;
                    state.priceCodes.current.priceCode.changed = true;
                }
            }

            if (!state.priceCodes.current.levels[level] && !!state.priceLevels.list[level] && state.priceCodes.current.priceCode) {
                state.priceCodes.current.levels[level] = state.priceCodes.current.priceCode;
                state.priceCodes.current.levels[level].CustomerPriceLevel = level;
                state.priceCodes.current.levels[level].DiscountMarkup1 = 0;
                state.priceCodes.current.levels[level].newDiscountMarkup1 = discount;
                state.priceCodes.current.levels[level].changed = true;
                return;
            }

            if (discount === state.priceCodes.current.levels[level].DiscountMarkup1) {
                state.priceCodes.current.levels[level].changed = discount !== state.priceCodes.current.levels[level].newDiscountMarkup1;
                state.priceCodes.current.levels[level].newDiscountMarkup1 = undefined;
            } else {
                state.priceCodes.current.levels[level].newDiscountMarkup1 = discount;
                state.priceCodes.current.levels[level].changed = true;
            }
        })


        .addCase(savePriceCode.pending, (state) => {
            state.priceCodes.current.loading = 'pending';
        })
        .addCase(savePriceCode.rejected, (state) => {
            state.priceCodes.current.loading = 'failed';
        })
        .addCase(savePriceCode.fulfilled, (state, action) => {
            state.priceCodes.current.loading = 'succeeded';
            if (!action.payload.priceCode) {
                if (action.meta.arg.PriceCode) {
                    delete state.priceLevels.current.priceCodes[action.meta.arg.PriceCode];
                }
                return;
            }
            state.priceLevels.current.priceCodes[action.payload.priceCode.PriceCode] = action.payload.priceCode;

            const key = priceCodeKey(action.payload.priceCode);
            const level = action.payload.priceCode?.CustomerPriceLevel || '';

            if (priceCodeKey(state.priceCodes.current.priceCode) === key) {
                state.priceCodes.current.priceCode = action.payload.priceCode;
            }
            if (!!level && !!state.priceCodes.current.levels[level] &&
                priceCodeKey(state.priceCodes.current.levels[level]) === key) {
                state.priceCodes.current.levels[level] = action.payload.priceCode;
            }
        })

        .addCase(deletePriceCodeChange.pending, (state) => {
            state.priceCodes.current.loading = 'pending';
        })
        .addCase(deletePriceCodeChange.rejected, (state) => {
            state.priceCodes.current.loading = 'failed';
        })
        .addCase(deletePriceCodeChange.fulfilled, (state, action) => {
            state.priceCodes.current.loading = 'succeeded';
            state.priceCodes.current.priceCode = null;
        })

        .addCase(loadPriceChangeUsers.pending, (state, action) => {
            state.changes.loading = 'pending';
        })
        .addCase(loadPriceChangeUsers.rejected, (state, action) => {
            state.changes.loading = 'failed';
        })
        .addCase(loadPriceChangeUsers.fulfilled, (state, action) => {
            state.changes.loading = 'succeeded';
            state.changes.users = action.payload.users;
        })

        .addCase(setCurrentUser.pending, (state, action) => {
            state.changes.loading = 'pending';
            state.changes.currentUser = action.meta.arg;
        })
        .addCase(setCurrentUser.rejected, (state, action) => {
            state.changes.loading = 'failed';
        })
        .addCase(setCurrentUser.fulfilled, (state, action) => {
            state.changes.loading = 'succeeded';
            state.changes.changes = action.payload.changes;
        })

        .addCase(setPLVisibility, (state, action) => {
            if (state.priceLevels.list[action.payload.priceLevel]) {
                state.priceLevels.list[action.payload.priceLevel].hidden = action.payload.hidden;
            }
        })
})

export default reducer;
