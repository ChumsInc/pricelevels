import classNames from "classnames";
import ItemDiscountedPrice from "./ItemDiscountedPrice";
import React from "react";
import {PriceCodeItem} from "chums-types";
import {EditablePriceCodeChange} from "../ducks/pricing/types";

export interface PriceLevelTDProps {
    priceCode: EditablePriceCodeChange | null,
    item: PriceCodeItem;
    onClick: () => void;
}

const PriceLevelTD = ({priceCode, item, onClick}: PriceLevelTDProps) => {
    const className = {
        'table-info': priceCode?.hasChange,
        'text-danger': priceCode?.changed
    }
    return (
        <td className={classNames("text-end", className)} onClick={onClick}>
            <ItemDiscountedPrice item={item} priceCode={priceCode || null} display="any"/>
        </td>
    )
}

export default PriceLevelTD;
