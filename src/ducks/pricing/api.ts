import {PriceLevel, BasePriceCodeInfo, PriceCodeItem, PriceCodeUser, PriceCodeChange} from 'chums-types';
import {fetchJSON} from 'chums-components';
import {PriceLevelCustomer, PriceLevelList, PriceLevelSaveSortProps} from "./types";


export async function fetchPriceLevels():Promise<PriceLevel[]> {
    try {
        const url = '/api/sales/pricing/chums/pricelevels';
        const {priceLevels} = await fetchJSON<{priceLevels:PriceLevel[]}>(url, {cache: 'no-cache'});
        return priceLevels;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchPriceLevels()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchPriceLevels()", err);
        return Promise.reject(new Error('Error in fetchPriceLevels()'));
    }
}

export async function fetchPriceLevel(priceLevel: string):Promise<{pricing: PriceCodeChange[], customers: PriceLevelCustomer[] }> {
    try {
        const url = `/api/sales/pricing/chums/pricelevels/${encodeURIComponent(priceLevel || ' ')}`;
        const {pricing, customers} = await fetchJSON<{pricing: PriceCodeChange[], customers: PriceLevelCustomer[]}>(url, {cache: 'no-cache'});
        return {pricing, customers};
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchPriceLevelCodes()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchPriceLevelCodes()", err);
        return Promise.reject(new Error('Error in fetchPriceLevelCodes()'));
    }
}

export async function postPriceLevel(priceLevel: PriceLevel):Promise<{pricing: PriceCodeChange[], customers: PriceLevelCustomer[] }> {
    try {
        const url = `/api/sales/pricing/chums/pricelevels/${encodeURIComponent(priceLevel.PriceLevel)}`;
        const body = JSON.stringify(priceLevel);
        const {pricing, customers} = await fetchJSON<{pricing: PriceCodeChange[], customers: PriceLevelCustomer[]}>(url, {method: 'POST', body});
        return {pricing, customers};
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchPriceLevelCodes()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchPriceLevelCodes()", err);
        return Promise.reject(new Error('Error in fetchPriceLevelCodes()'));
    }
}


export async function postPriceLevelSort(levels:PriceLevel[]):Promise<PriceLevel[]> {
    try {
        const body:PriceLevelSaveSortProps[] = levels.map((pl, index) => ({PriceLevel: pl.PriceLevel, SortOrder: (index + 1) * 10}));
        const url = '/api/sales/pricing/chums/pricelevels/sort';
        const {priceLevels} = await fetchJSON<{priceLevels:PriceLevel[]}>(url, {method: 'POST', body: JSON.stringify(body)});
        return priceLevels;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("postPriceLevelSort()", err.message);
            return Promise.reject(err);
        }
        console.warn("postPriceLevelSort()", err);
        return Promise.reject(new Error('Error in postPriceLevelSort()'));
    }
}

export async function fetchPriceCodes():Promise<PriceCodeChange[]> {
    try {
        const url = '/api/sales/pricing/chums/pricecodes';
        const {priceCodes} = await fetchJSON<{priceCodes: PriceCodeChange[]}>(url, {cache: 'no-cache'});
        return priceCodes;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchPriceCodes()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchPriceCodes()", err);
        return Promise.reject(new Error('Error in fetchPriceCodes()'));
    }
}

export async function fetchPriceCode(priceCode:string):Promise<{pricing: PriceCodeChange[], items: PriceCodeItem[]}> {
    try {
        const url = `/api/sales/pricing/chums/pricecodes/${encodeURIComponent(priceCode)}`;
        const {pricing, items} = await fetchJSON<{pricing: PriceCodeChange[], items: PriceCodeItem[]}>(url, {cache: 'no-cache'});
        return {pricing, items};
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchPriceCode()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchPriceCode()", err);
        return Promise.reject(new Error('Error in fetchPriceCode()'));
    }
}

export async function fetchPriceCodeUsers():Promise<PriceCodeUser[]> {
    try {
        const url = '/api/sales/pricing/chums/changes';
        return await fetchJSON<PriceCodeUser[]>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchPriceCodeUsers()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchPriceCodeUsers()", err);
        return Promise.reject(new Error('Error in fetchPriceCodeUsers()'));
    }
}

export async function fetchUserChanges(username: string, ignore?: boolean):Promise<PriceCodeChange[]> {
    try {
        const params = new URLSearchParams();
        if (ignore) {
            params.set('ignoreUpdaes', 'ignore')
        }
        const url = `/api/sales/pricing/chums/changes/${encodeURIComponent(username)}?${params.toString()}`;
        return await fetchJSON<PriceCodeChange[]>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchUserChanges()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchUserChanges()", err);
        return Promise.reject(new Error('Error in fetchUserChanges()'));
    }
}

export async function postPriceCodeChange(pc:PriceCodeChange):Promise<PriceCodeChange> {
    try {
        const url = `/api/sales/pricing/chums/${encodeURIComponent(pc.PriceCode)}/${encodeURIComponent(pc.CustomerPriceLevel)}`;
        const body = JSON.stringify(pc);
        const {pricing} = await fetchJSON<{pricing: PriceCodeChange[]}>(url, {method: 'POST', body});
        const [priceCode] = pricing;
        return priceCode;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("postChange()", err.message);
            return Promise.reject(err);
        }
        console.warn("postChange()", err);
        return Promise.reject(new Error('Error in postChange()'));
    }
}

export async function deleteChange(pc:PriceCodeChange):Promise<PriceCodeChange> {
    try {
        const url = `/api/sales/pricing/chums/${encodeURIComponent(pc.PriceCode)}/${encodeURIComponent(pc.CustomerPriceLevel)}`;
        const {pricing} = await fetchJSON<{pricing: PriceCodeChange[]}>(url, {method: 'DELETE'});
        const [priceCode] = pricing;
        return priceCode;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("deleteChange()", err.message);
            return Promise.reject(err);
        }
        console.warn("deleteChange()", err);
        return Promise.reject(new Error('Error in deleteChange()'));
    }
}
