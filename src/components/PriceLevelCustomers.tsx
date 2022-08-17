import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectPriceLevelCustomers} from "../ducks/pricing";
import {useEffect, useState} from "react";
import {calcPages, filterPage, Pager, RowsPerPage, SortableTable, SortProps} from "chums-components";
import {PriceLevelCustomerSort, PriceLevelCustomerTableField} from "../ducks/pricing/types";
import {customerKey, customerSort} from "../ducks/pricing/utils";

const dateOptions:Intl.DateTimeFormatOptions = {month: '2-digit', day: '2-digit', year: 'numeric'};
const formatDate = (str:string) => new Date(str).toLocaleDateString(undefined, dateOptions);

const fields:PriceLevelCustomerTableField[] = [
    {field: "CustomerNo", title: 'Customer No', sortable: true, render: (row) => `${row.ARDivisionNo}-${row.CustomerNo}`},
    {field: "CustomerName", title: 'Customer Name', sortable: true},
    {field: "CustomerType", title: 'Name', sortable: true, render: (row) => row.CustomerType || ''},
    {field: "DateLastActivity", title: 'Last Activty', sortable: true, render: (row) => !!row.DateLastActivity ? formatDate(row.DateLastActivity) : '-'},
    {field: "LastOrderDate", title: 'Last Order', sortable: true, render: (row) => !!row.LastOrderDate ? formatDate(row.LastOrderDate) : '-'},

]
const PriceLevelCustomers = () => {
    const disptach = useAppDispatch();
    const customers = useAppSelector(selectPriceLevelCustomers);

    const [sort, setSort] = useState<PriceLevelCustomerSort>({field: 'CustomerNo', ascending: true})
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [pages, setPages] = useState(calcPages(customers.length, rowsPerPage));
    const [data, setData] = useState(() => customers.filter(filterPage(page, rowsPerPage)));

    useEffect(() => {
        const maxPages = calcPages(customers.length, rowsPerPage);
        if (maxPages < page) {
            setPage(1);
        }
        setPages(maxPages);
    }, [customers.length, rowsPerPage]);

    useEffect(() => {
        const rows = [...customers]
            .sort(customerSort(sort))
            .filter(filterPage(page, rowsPerPage));
        setData(rows);
    }, [customers, rowsPerPage, page, sort]);



    const onChangeSort = (nextSort:SortProps) => {
        if (nextSort.field !== sort.field) {
            setPage(1);
        }
        setSort(nextSort as PriceLevelCustomerSort);
    }

    return (
        <div>
            <SortableTable size="xs" fields={fields} data={data} currentSort={sort} keyField={(row) => customerKey(row)} onChangeSort={onChangeSort} />
            <Pager page={page} rowsPerPage={rowsPerPage} dataLength={customers.length} onChangePage={setPage} onChangeRowsPerPage={setRowsPerPage} />
        </div>
    )
}

export default PriceLevelCustomers;
