import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {PriceCodeSortProps, PriceCodeTableField} from "../ducks/pricing/types";
import {SortableTable, SortProps} from "chums-components";
import {useEffect, useState} from "react";
import {
    selectCurrentPriceCode,
    selectCurrentPriceLevelCodes,
    selectPriceCodes,
    setCurrentPriceCode
} from "../ducks/pricing";
import {PriceCodeChange} from "chums-types";
import {newDiscountRate, priceCodeSort} from "../ducks/pricing/utils";


const defaultSort:PriceCodeSortProps = {
    field: 'PriceCode',
    ascending: true
}

const fields:PriceCodeTableField[] = [
    {field: 'PriceCode', title: 'Price Code', sortable: true},
    {field: 'PriceCodeDesc', title: "Description", sortable: true},
    {field: 'DiscountMarkup1', title: 'Discount', sortable: true, render: (row) => row.DiscountMarkup1 === 0 ? '-' : row.DiscountMarkup1.toFixed(3), className: 'text-end'},
    {field: 'DateUpdated', title: 'Updated', sortable: true, render: (row) => !row.DateUpdated ? 'new' : new Date(row.DateUpdated).toLocaleDateString(), className: 'text-end'},
    {field: 'newDiscountMarkup1', title: 'New Discount', sortable: true, render: (row) => newDiscountRate(row)?.toFixed(3) ?? '', className: 'text-end'},
    {field: 'UserName', title: 'Updated by', sortable: true, render: (row) => row.UserName},
    {field: 'timestamp', title: 'Changed', sortable: true, render: (row) => row.hasChange ? new Date(row.timestamp || new Date()).toLocaleDateString() : null},
]

export interface PriceCodesTableProps {
    filter: string;
    filterChanged?: boolean,
}

const PriceCodesTable = ({filter, filterChanged}:PriceCodesTableProps) => {
    const dispatch = useAppDispatch();
    const priceCodes = useAppSelector(selectCurrentPriceLevelCodes);
    const [sort, setSort] = useState<PriceCodeSortProps>(defaultSort);
    const [data, setData] = useState<PriceCodeChange[]>(Object.values(priceCodes));
    const priceCode = useAppSelector(selectCurrentPriceCode);

    useEffect(() => {
        const rows = Object.values(priceCodes)
            .filter(row => !filterChanged || row.hasChange)
            .filter(row => !filter
                || row.PriceCode.toLowerCase().includes(filter.toLowerCase())
                || row.PriceCodeDesc.toLowerCase().includes(filter.toLowerCase()))
            .sort(priceCodeSort(sort));
        setData(rows);
    }, [sort, filter, filterChanged, priceCodes]);

    const onSelectRow = (row:PriceCodeChange) => {
        dispatch(setCurrentPriceCode(row));
    }

    const onChangeSort = (newSort:SortProps) => setSort(newSort as PriceCodeSortProps);
    return (
        <div className="mt-3" style={{maxHeight: '95vh', overflow: 'auto'}}>
            <SortableTable size="xs" className="table-sticky-0" fields={fields} data={data}
                           selected={priceCode?.PriceCode}
                           currentSort={sort} keyField="PriceCode"
                           onChangeSort={onChangeSort} rowClassName={(row) => row.hasChange ? 'text-primary' : null}
                           onSelectRow={onSelectRow}
            />
        </div>
    )
}

export default PriceCodesTable;
