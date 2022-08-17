import {PriceCodeSortProps, PriceCodeTableField} from "../ducks/pricing/types";
import {newDiscountRate, priceCodeKey, priceCodeSort} from "../ducks/pricing/utils";
import {useAppSelector} from "../app/configureStore";
import {selectChanges} from "../ducks/pricing";
import {Alert, pageFilter, Pager, SortableTable, SortProps} from "chums-components";
import React, {useEffect, useState} from "react";
import {PriceCodeChange} from "chums-types";

const fields:PriceCodeTableField[] = [
    {field: 'CustomerPriceLevel', title: 'Price Level', sortable: true},
    {field: 'PriceCode', title: 'Price Code', sortable: true},
    {field: 'PriceCodeDesc', title: "Description", sortable: true},
    {field: 'DiscountMarkup1', title: 'Discount', sortable: true, render: (row) => row.DiscountMarkup1 === 0 ? '-' : row.DiscountMarkup1.toFixed(3), className: 'text-end'},
    {field: 'DateUpdated', title: 'Updated', sortable: true, render: (row) => !!row.DateUpdated ? new Date(row.DateUpdated).toLocaleDateString() : 'new', className: 'text-end'},
    {field: 'newDiscountMarkup1', title: 'New Discount', sortable: true, render: (row) => newDiscountRate(row)?.toFixed(3) ?? '', className: 'text-end'},
    {field: 'UserName', title: 'Updated by', sortable: true, render: (row) => row.UserName},
    {field: 'timestamp', title: 'Changed', sortable: true, render: (row) => row.hasChange ? new Date(row.timestamp || new Date()).toLocaleDateString() : null},
]

const defaultSort:PriceCodeSortProps = {field: 'PriceCode', ascending: true};

const UserChangeTable = () => {
    const changes = useAppSelector(selectChanges);
    const [sort, setSort] = useState<PriceCodeSortProps>(defaultSort);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [data, setData] = useState<PriceCodeChange[]>([]);

    useEffect(() => {
        const rows = changes
            .sort(priceCodeSort(sort))
            .filter(pageFilter(page, rowsPerPage));
        setData(rows);
    }, [changes, sort, page, rowsPerPage])

    const sortChangeHandler = (sort:SortProps) => {
        setPage(1);
        setSort(sort as PriceCodeSortProps)
    }

    return (
        <div>
            <SortableTable fields={fields} data={data} currentSort={defaultSort} keyField={row => priceCodeKey(row)}
                           onChangeSort={sortChangeHandler} />
            {changes.length === 0 && (<Alert color="secondary">No data</Alert>)}
            <Pager page={page} rowsPerPage={rowsPerPage} dataLength={changes.length} onChangePage={setPage} onChangeRowsPerPage={setRowsPerPage} />
        </div>
        )
}

export default React.memo(UserChangeTable);
