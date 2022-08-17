import {
    Editable,
    LoadingStatus,
    PriceCodeChange,
    PriceCodeItem,
    PriceCodeUser,
    PriceLevel,
    PricingMethod
} from 'chums-types';
import {SortableTableField, SortProps} from "chums-components";
import Decimal from 'decimal.js'

export interface EditablePriceCodeChange extends PriceCodeChange, Editable {
}

export interface EditablePriceLevel extends PriceLevel, Editable {
    hidden?: boolean;
}

export interface PriceCodeList {
    [key: string]: EditablePriceCodeChange;
}

export interface PriceLevelList {
    [key: string]: EditablePriceLevel
}

export interface PriceCodeState {
    // should be mainitained with list of price codes without price levels.
    list: PriceCodeList;
    loading: LoadingStatus;
    loaded: boolean;
    current: {
        priceCode: EditablePriceCodeChange | null;
        loading: LoadingStatus;
        items: PriceCodeItem[];
        levels: PriceCodeList;
    }
}

export interface PriceLevelState {
    list: PriceLevelList
    loading: LoadingStatus;
    loaded: boolean;
    current: {
        priceLevel: EditablePriceLevel | null;
        loading: LoadingStatus;
        customers: PriceLevelCustomer[],
        priceCodes: PriceCodeList;
    }
}

export interface PricingState {
    priceCodes: PriceCodeState;
    priceLevels: PriceLevelState;
    changes: {
        users: PriceCodeUser[],
        loading: LoadingStatus;
        currentUser: string|null;
        changes: PriceCodeChange[];
    };
}

export interface PriceCodeTableField extends SortableTableField {
    field: keyof PriceCodeChange,
    render?: (row: PriceCodeChange) => any
}

export interface PriceCodeSortProps extends SortProps {
    field: keyof PriceCodeChange
}

export type PriceCalculator = {
    [key in PricingMethod]: (item: PriceCodeItem, discountMarkup: Decimal.Value) => Decimal;
};


export interface PriceCodeItemsTableField extends SortableTableField {
    field: keyof PriceCodeItem,
    render?: (row: PriceCodeItem) => any
}

export interface PriceCodeItemsSortProps extends SortProps {
    field: keyof PriceCodeItem;
}

export type PriceDisplay = 'current-price' | 'next-price' | 'any';

export interface PriceLevelTableField extends SortableTableField {
    field: keyof EditablePriceLevel;
    render?: (row: EditablePriceLevel) => any;
}

export interface PriceLevelCustomer {
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerName: string;
    CustomerType: string|null;
    DateLastActivity: string;
    LastOrderDate: string;
}

export interface PriceLevelCustomerTableField extends SortableTableField {
    field: keyof PriceLevelCustomer;
    render?: (row:PriceLevelCustomer) => any;
}

export interface PriceLevelCustomerSort extends SortProps {
    field: keyof PriceLevelCustomer
}

export type PriceLevelSaveSortProps = Pick<PriceLevel, 'PriceLevel' | 'SortOrder'>;

export interface PriceLevelVisibility {
    PriceLevel: string;
    hidden: boolean;
}

export interface PriceLevelVisibilityList {
    [key:string]: PriceLevelVisibility
}
