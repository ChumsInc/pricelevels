import {PriceCodeChange, PriceCodeItem, PriceLevel} from "chums-types";
import {
    PriceCalculator,
    PriceCodeItemsSortProps,
    PriceCodeSortProps,
    PriceDisplay,
    PriceLevelCustomer,
    PriceLevelCustomerSort
} from "./types";
import Decimal from "decimal.js";
import {BasePriceCode} from "chums-types/pricing";

export const priceCodeKey = (pc:PriceCodeChange|null) => `${pc?.PriceCode}:${pc?.PriceCodeRecord}:${pc?.CustomerPriceLevel}`;

export const priceLevelSort = (a: PriceLevel, b: PriceLevel) => a.SortOrder - b.SortOrder;

export const priceCodeSort = (sort: PriceCodeSortProps) => (a: PriceCodeChange, b: PriceCodeChange) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
    case 'PriceCode':
    case 'PriceCodeDesc':
    case 'PricingMethod':
    case 'CustomerPriceLevel':
    case 'DateUpdated':
        return (
            a[field].toUpperCase() === b[field].toUpperCase()
                ? (a.PriceCode.toUpperCase() > b.PriceCode.toUpperCase() ? 1 : -1)
                : (a[field].toUpperCase() > b[field].toUpperCase() ? 1 : -1)
        ) * sortMod;
    case 'timestamp':
    case 'UserName':
        return (
            (a[field] || '').toUpperCase() === (b[field] || '').toUpperCase()
                ? (a.PriceCode.toUpperCase() > b.PriceCode.toUpperCase() ? 1 : -1)
                : ((a[field] || '').toUpperCase() > (b[field] || '').toUpperCase() ? 1 : -1)
        ) * sortMod;
    case 'BreakQuantity1':
    case 'DiscountMarkup1':
        return (
            a[field] === b[field]
                ? (a.PriceCode.toUpperCase() > b.PriceCode.toUpperCase() ? 1 : -1)
                : (a[field] > b[field] ? 1 : -1)
        ) * sortMod;
    case 'newDiscountMarkup1':
        return (
            (a[field] ?? a.DiscountMarkup1) === (b[field] ?? b.DiscountMarkup1)
                ? (a.PriceCode.toUpperCase() > b.PriceCode.toUpperCase() ? 1 : -1)
                : ((a[field] ?? a.DiscountMarkup1) > (b[field] ?? b.DiscountMarkup1) ? 1 : -1)
        ) * sortMod;

    default:
        return (a.PriceCode.toUpperCase() > b.PriceCode.toUpperCase() ? 1 : -1) * sortMod;
    }
}

export const hasPriceChange = (priceCode:PriceCodeChange):boolean => {
    return (
        !!priceCode.timestamp && !!priceCode.DateUpdated
        && (new Date(priceCode.timestamp).valueOf() > new Date(priceCode.DateUpdated).valueOf())
        && ((priceCode.newDiscountMarkup1??0)!== priceCode.DiscountMarkup1)
    ) || (!priceCode.DateUpdated && (priceCode.newDiscountMarkup1??0) !== 0);
}
export const newDiscountRate = (priceCode: PriceCodeChange):number|null => {
    return priceCode.hasChange ? (priceCode.newDiscountMarkup1 ?? null) : null;
}

export const calculatePrice = (priceCode:PriceCodeChange|null, item:PriceCodeItem, whichPrice:PriceDisplay = 'any'):Decimal => {
    const discountMarkup = getDiscountField(priceCode, whichPrice);
    switch (priceCode?.PricingMethod) {
    case 'C':
        return new Decimal(item.AverageUnitCost).add(discountMarkup);
    case 'D':
        return new Decimal(1).sub(new Decimal(discountMarkup).dividedBy(100)).times(item.StandardUnitPrice);
    case 'M':
        return new Decimal(item.StandardUnitPrice).times(new Decimal(discountMarkup).dividedBy(100).add(1));
    case 'O':
        return new Decimal(discountMarkup);
    case 'P':
        return new Decimal(item.StandardUnitPrice).sub(discountMarkup);
    default:
        return new Decimal(item.StandardUnitPrice);
    }
}

export const priceCalc:PriceCalculator = {
    D: (item, discountMarkup) => {
        return discountMarkup === '' || discountMarkup === undefined
            ? new Decimal(item.StandardUnitPrice)
            : new Decimal(1).sub(new Decimal(discountMarkup).dividedBy(100)).times(item.StandardUnitPrice);
            // : (1 - (new Decimal(discountMarkup) / 100)) * stdPrice;
    },
    P: (item, discountMarkup) => {
        return discountMarkup === '' || discountMarkup === undefined
            ? new Decimal(item.StandardUnitPrice)
            : new Decimal(item.StandardUnitPrice).sub(discountMarkup);
    },
    O: (item, discountMarkup) => new Decimal(discountMarkup),
    C: (item, discountMarkup) => new Decimal(item.AverageUnitCost).add(discountMarkup || '0'),
    M: (item, discountMarkup) => new Decimal(item.StandardUnitPrice).mul(new Decimal(discountMarkup || '0').dividedBy(100).add(1)),
};


export const itemSort = (sort:PriceCodeItemsSortProps) => (a:PriceCodeItem, b:PriceCodeItem) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
    case 'AverageUnitCost':
    case 'StandardUnitPrice':
    case 'SuggestedRetailPrice':
        return (a[field] === b[field]
            ? (a.ItemCode > b.ItemCode ? 1 : -1)
            : (a[field] - b[field])) * sortMod;
    case 'ItemCode':
    case 'ItemCodeDesc':
    case 'StandardUnitOfMeasure':
        return (
            a[field].toUpperCase() === b[field].toUpperCase()
            ? (a.ItemCode > b.ItemCode ? 1 : -1)
            : (a[field].toUpperCase() >  b[field].toUpperCase() ? 1 : -1)
        ) * sortMod;
    default:
        return (a.ItemCode > b.ItemCode ? 1 : -1) * sortMod;
    }
}

export function getDiscountField(priceCode:PriceCodeChange|null, display: PriceDisplay) {
    switch (display) {
    case 'current-price':
        return priceCode?.DiscountMarkup1 ?? 0;
    case 'next-price':
        return priceCode?.newDiscountMarkup1 ?? 0;
    case 'any':
    default:
        return priceCode?.newDiscountMarkup1 ?? priceCode?.DiscountMarkup1 ?? 0;
    }
}

export const customerKey = (customer:PriceLevelCustomer) => `${customer.ARDivisionNo}-${customer.CustomerNo}`.toUpperCase();


export const customerSort = (props:PriceLevelCustomerSort) => (a:PriceLevelCustomer, b:PriceLevelCustomer) => {
    const {field, ascending} = props;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
    case 'CustomerName':
    case 'CustomerType':
        return (
            (a[field] || '').toUpperCase() === (b[field] || '').toUpperCase()
            ? (customerKey(a) > customerKey(b) ? 1 : -1)
            : ((a[field] || '').toUpperCase() > (b[field] || '').toUpperCase() ? 1 : -1)
        ) * sortMod;
    case 'DateLastActivity':
    case 'LastOrderDate':
        return (
            a[field] === b[field]
            ? (customerKey(a) > customerKey(b) ? 1 : -1)
            : ((!!a[field] ? new Date(a[field]).valueOf() : 0) - (!!b[field] ? new Date(b[field]).valueOf() : 0))
        ) * sortMod;
    case 'ARDivisionNo':
    case 'CustomerNo':
    default:
        return ((customerKey(a) > customerKey(b)) ? 1 : -1) * sortMod;
    }
}
