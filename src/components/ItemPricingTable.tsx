import {PriceCodeItem} from "chums-types";
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectCurrentPriceCodeLevels, selectPriceCodeItems, selectPriceLevels,} from "../ducks/pricing/selectors";
import {priceLevelSort} from "../ducks/pricing/utils";
import React, {ChangeEvent} from "react";
import classNames from "classnames";
import PriceLevelTH from "./PriceLevelTH";
import PriceLevelTD from "./PriceLevelTD";
import Decimal from "decimal.js";
import {setPriceCodeLevelDiscount} from "../ducks/pricing/actions";

export interface ItemPricingTableProps {
    item: PriceCodeItem | null;
    onSelectRow: (row: PriceCodeItem) => void;
    filter: string;
    onSelectPriceLevel: (level: string) => void;
}

const ItemPricingTable = ({item, onSelectRow, filter, onSelectPriceLevel,}: ItemPricingTableProps) => {
    const dispatch = useAppDispatch();
    const priceLevels = useAppSelector(selectPriceLevels);
    const priceCodeLevels = useAppSelector(selectCurrentPriceCodeLevels);
    const items = useAppSelector(selectPriceCodeItems);

    const onChangeDiscount = (level: string) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setPriceCodeLevelDiscount(level, ev.target.valueAsNumber || 0))
    }

    return (
        <>
            <table className="table table-xs table-sticky pricing-table">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>U/M</th>
                    <th>Std Price</th>
                    <th>Avg Cost</th>
                    {Object.values(priceLevels).sort(priceLevelSort)
                        .filter(pl => !pl.hidden)
                        .map(pl => (
                            <PriceLevelTH key={pl.PriceLevel} priceCode={priceCodeLevels[pl.PriceLevel]} priceLevel={pl}
                                          onChangeDiscount={onChangeDiscount(pl.PriceLevel)}
                                          onSelectPriceLevel={onSelectPriceLevel}/>
                        ))}
                </tr>
                </thead>
                <tbody>
                {items
                    .filter(i => !filter || i.ItemCode.includes(filter))
                    .map(i => (
                        <tr key={i.ItemCode} onClick={() => onSelectRow(i)}
                            className={classNames({'table-active': i.ItemCode === item?.ItemCode})}>
                            <th>{i.ItemCode}</th>
                            <td>{i.StandardUnitOfMeasure}</td>
                            <td className="text-end text-primary">{new Decimal(i.StandardUnitPrice).toFixed(2)}</td>
                            <td className="text-end text-primary">{new Decimal(i.AverageUnitCost).toFixed(4)}</td>
                            {Object.values(priceLevels).sort(priceLevelSort)
                                .filter(pl => !pl.hidden)
                                .map(pl => (
                                    <PriceLevelTD key={pl.PriceLevel} item={i}
                                                  priceCode={priceCodeLevels[pl.PriceLevel]}
                                                  onClick={() => onSelectPriceLevel(pl.PriceLevel)}/>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )

}

export default React.memo(ItemPricingTable);
