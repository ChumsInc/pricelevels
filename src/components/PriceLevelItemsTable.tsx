import {useAppSelector} from "../app/configureStore";
import {selectPriceCodeItems} from "../ducks/pricing";
import {PriceCodeItemsSortProps, PriceCodeItemsTableField} from "../ducks/pricing/types";
import {useEffect, useState} from "react";
import {PriceCodeItem} from "chums-types";
import {SortableTable, SortProps} from "chums-components";
import {itemSort} from "../ducks/pricing/utils";
import Decimal from "decimal.js";
import ConnectedItemDiscountedPrice from "./ConnectedItemDiscountedPrice";

const defaultSort: PriceCodeItemsSortProps = {
    field: 'ItemCode',
    ascending: true
}

const fields: PriceCodeItemsTableField[] = [
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'ItemCodeDesc', title: "Description", sortable: true},
    {field: 'StandardUnitOfMeasure', title: "U/M", sortable: true},
    {
        field: 'AverageUnitCost',
        title: 'Avg Cost',
        sortable: true,
        render: (row) => new Decimal(row.AverageUnitCost).toFixed(4),
        className: 'text-end'
    },
    {
        field: 'StandardUnitPrice',
        title: 'Std Price',
        sortable: true,
        render: (row) => new Decimal(row.StandardUnitPrice).toFixed(2),
        className: 'text-end'
    },
    {
        field: 'StandardUnitPrice',
        title: 'Discounted Price',
        render: (row) => <ConnectedItemDiscountedPrice item={row} display="current-price"/>,
        className: 'text-end'
    },
    {
        field: 'StandardUnitPrice',
        title: 'New Price',
        render: (row) => <ConnectedItemDiscountedPrice item={row} display="next-price"/>,
        className: 'text-end text-danger'
    },
];

export interface PriceLevelItemsTableProps {
    item: PriceCodeItem | null;
    onSelectRow: (row: PriceCodeItem) => void;
}

const PriceLevelItemsTable = ({item, onSelectRow}: PriceLevelItemsTableProps) => {
    const items = useAppSelector(selectPriceCodeItems);
    const [data, setData] = useState<PriceCodeItem[]>(items);
    const [sort, setSort] = useState<PriceCodeItemsSortProps>(defaultSort);

    useEffect(() => {
        const sorted = [...items].sort(itemSort(sort));
        setData(() => sorted);
    }, [sort.field, sort.ascending, items])

    const onChangeSort = (newSort: SortProps) => setSort(newSort as PriceCodeItemsSortProps);

    return (
        <div className="mt-3">
            <SortableTable size="xs" className="table-sticky" fields={fields} data={data}
                           selected={item?.ItemCode}
                           currentSort={sort} keyField="ItemCode" onSelectRow={onSelectRow}
                           onChangeSort={onChangeSort} rowClassName={(row) => row.hasChange ? 'text-primary' : null}
            />
        </div>
    )
}

export default PriceLevelItemsTable;
