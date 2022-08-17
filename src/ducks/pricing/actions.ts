import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {PriceCodeChange, PriceCodeItem, PriceCodeUser, PriceLevel} from "chums-types";
import {PriceCodeList, PriceLevelCustomer, PriceLevelList, PriceLevelVisibilityList} from "./types";
import {
    fetchPriceCode,
    fetchPriceCodes,
    fetchPriceCodeUsers,
    fetchPriceLevel,
    fetchPriceLevels,
    fetchUserChanges,
    postPriceCodeChange,
    postPriceLevel,
    postPriceLevelSort
} from "./api";
import {BasePriceCode} from "chums-types/pricing";
import {SessionStore} from "chums-components";
import {sessionStorageVisibilityKey} from "../../constants";

const loadPriceLevelsPrefix = 'pricing/priceLevels/load';
const loadPriceCodesPrefix = 'pricing/priceCodes/load';
const setCurrentPriceCodePrefix = 'pricing/priceCodes/setCurrent';
const setCurrentPriceLevelPrefix = 'pricing/priceLevels/setCurrent';
const saveCurrentPriceLevelPrefix = 'pricing/priceLevels/saveCurrent';
const savePriceLevelSortPrefix = 'pricing/priceLevels/saveSort';
const savePriceCodePrefix = 'pricing/priceCodes/current/save';
const deletePriceCodePrefix = 'pricing/priceCodes/current/delete';
const loadPriceChangeUsersPrefix = 'pricing/loadUsers';
const loadUserChangesPrefix = 'pricing/loadChanges'

export const setPriceCodeLevelDiscount = createAction('pricing/priceCode/setLevelDiscount', (level: string, discount: number) => {
    return {
        payload: {
            level,
            discount
        }
    }
});

export const updatePriceLevel = createAction<Partial<PriceLevel>>('pricing/priceLevels/current/update');

export const loadPriceLevels = createAsyncThunk<{ list: PriceLevelList, clearContext?: string }>(
    loadPriceLevelsPrefix,
    async (asd, thunkApi) => {
        try {
            const priceLevels = await fetchPriceLevels();
            const list: PriceLevelList = {};
            priceLevels.forEach(pl => list[pl.PriceLevel] = pl);
            const visible: PriceLevelVisibilityList = SessionStore.getItem(sessionStorageVisibilityKey) || {};
            Object.values(visible).forEach(v => {
                if (list[v.PriceLevel]) {
                    list[v.PriceLevel].hidden = v.hidden;
                }
            })
            return {list, clearContext: loadPriceLevelsPrefix};
        } catch (err: unknown) {
            if (err instanceof Error) {
                return thunkApi.rejectWithValue({error: err, context: loadPriceLevelsPrefix});
            }
            return {list: {}};
        }
    }
)

export const saveCurrentPriceLevel = createAsyncThunk<{ list: PriceCodeList, customers: PriceLevelCustomer[] }, PriceLevel>(
    saveCurrentPriceLevelPrefix,
    async (priceLevel, thunkAPI) => {
        try {
            const {pricing, customers} = await postPriceLevel(priceLevel);
            const list: PriceCodeList = {};
            pricing.forEach(pc => list[pc.PriceCode] = pc);
            return {list, customers};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.warn("savePriceLevel()", err.message);
                return thunkAPI.rejectWithValue({error: err, context: saveCurrentPriceLevelPrefix})
            }
            return {list: {}, customers: []}
        }
    }
)

export const savePriceLevelSort = createAsyncThunk<{ list: PriceLevelList, clearContext?: string }, PriceLevel[]>(
    savePriceLevelSortPrefix,
    async (levels, thunkApi) => {
        try {
            const priceLevels = await postPriceLevelSort(levels);
            const list: PriceLevelList = {};
            priceLevels.forEach(pl => list[pl.PriceLevel] = pl);
            const visible: PriceLevelVisibilityList = SessionStore.getItem(sessionStorageVisibilityKey) || {};
            Object.values(visible).forEach(v => {
                if (list[v.PriceLevel]) {
                    list[v.PriceLevel].hidden = v.hidden;
                }
            })
            return {list, clearContext: loadPriceLevelsPrefix};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("savePriceLevelSort()", err.message);
                return thunkApi.rejectWithValue({error: err, context: savePriceLevelSortPrefix});
            }
            return {list: {}};
        }
    }
)

export const loadPriceCodes = createAsyncThunk<{ list: PriceCodeList, clearContext?: string }>(
    loadPriceCodesPrefix,
    async (asd, thunkApi) => {
        try {
            const priceCodes = await fetchPriceCodes();
            const list: PriceCodeList = {};
            priceCodes.forEach(pc => list[pc.PriceCode] = pc);
            return {list, clearContext: loadPriceCodesPrefix};
        } catch (err: unknown) {
            if (err instanceof Error) {
                return thunkApi.rejectWithValue({error: err, context: loadPriceCodesPrefix});
            }
            return {list: {}};
        }
    }
)

export const setCurrentPriceCode = createAsyncThunk<{ levels: PriceCodeList, items: PriceCodeItem[] }, BasePriceCode | null>(
    setCurrentPriceCodePrefix,
    async (pc, thunkApi) => {
        try {
            if (!pc) {
                return {levels: {}, items: []};
            }
            const {pricing, items} = await fetchPriceCode(pc.PriceCode);
            const levels: PriceCodeList = {};
            pricing
                .filter(pc => !!pc.CustomerPriceLevel)
                .forEach(pc => levels[pc.CustomerPriceLevel] = pc);
            return {levels, items};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("setCurrentPriceCode()", err.message);
                return thunkApi.rejectWithValue({error: err, context: setCurrentPriceCodePrefix});
            }
            return {levels: {}, items: []};
        }
    }
)

export const setCurrentPriceLevel = createAsyncThunk<{ list: PriceCodeList, customers: PriceLevelCustomer[] }, PriceLevel | null>(
    setCurrentPriceLevelPrefix,
    async (pl, thunkApi) => {
        try {
            const {pricing, customers} = await fetchPriceLevel(pl?.PriceLevel ?? '');
            const list: PriceCodeList = {};
            pricing.forEach(pc => list[pc.PriceCode] = pc);
            return {list, customers};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("setCurrentPriceLevel()", err.message);
                return thunkApi.rejectWithValue({error: err, context: setCurrentPriceLevelPrefix});
            }
            return {list: {}, customers: []};
        }
    }
)

export const savePriceCode = createAsyncThunk<{ priceCode: PriceCodeChange | null, clearContext?: string }, PriceCodeChange>(
    savePriceCodePrefix,
    async (pc, thunkApi) => {
        try {
            const priceCode = await postPriceCodeChange(pc);
            return {priceCode, clearContext: savePriceCodePrefix};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("savePriceCode()", err.message);
                return thunkApi.rejectWithValue({error: err, context: savePriceCodePrefix});
            }
            return {priceCode: null};
        }
    }
)

export const deletePriceCodeChange = createAsyncThunk<{ priceCode: PriceCodeChange | null, clearContext?: string }, PriceCodeChange>(
    deletePriceCodePrefix,
    async (priceCode, thunkApi) => {
        try {
            await deletePriceCodeChange(priceCode);
            return {priceCode, clearContext: savePriceCodePrefix};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("savePriceCode()", err.message);
                return thunkApi.rejectWithValue({error: err, context: savePriceCodePrefix});
            }
            return {priceCode: null};
        }
    }
)

export const loadPriceChangeUsers = createAsyncThunk<{ users: PriceCodeUser[], clearContext?: string }>(
    loadPriceChangeUsersPrefix,
    async (asd, thunkApi) => {
        try {
            const users = await fetchPriceCodeUsers();
            return {users, clearContext: loadPriceChangeUsersPrefix};
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("loadPriceChangeUsers()", err.message);
                return thunkApi.rejectWithValue({error: err, context: loadPriceChangeUsersPrefix});
            }
            return {users: []};
        }
    }
)

export const setCurrentUser = createAsyncThunk<{ changes: PriceCodeChange[], clearContext?: string }, string>(
    loadUserChangesPrefix,
    async (username, thunkApi) => {
        try {
            if (!username) {
                return {changes: []};
            }
            const changes = await fetchUserChanges(username);
            return {changes, clearContext: loadUserChangesPrefix}
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("loadPriceChangeUsers()", err.message);
                return thunkApi.rejectWithValue({error: err, context: loadUserChangesPrefix});
            }
            return {changes: []};
        }
    }
)

export const setPLVisibility = createAction('pricing/setVisibility', (priceLevel: string, hidden: boolean) => {
    return {
        payload: {
            priceLevel,
            hidden,
        }
    }
});
