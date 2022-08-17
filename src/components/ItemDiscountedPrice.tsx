import {PriceCodeItem} from "chums-types";
import {calculatePrice} from "../ducks/pricing/utils";
import {EditablePriceCodeChange, PriceDisplay} from "../ducks/pricing/types";
import React from "react";
import classNames from "classnames";


export interface ItemDiscountedPriceProps {
    item: PriceCodeItem;
    priceCode: EditablePriceCodeChange | null;
    display: PriceDisplay
}


const ItemDiscountedPrice = ({item, priceCode, display}: ItemDiscountedPriceProps) => {
    if (display === 'next-price' && !priceCode?.hasChange && !priceCode?.changed) {
        return null;
    }
    const price = calculatePrice(priceCode, item, display);
    const ltZero = price.isNeg();
    const ltCost = price.sub(item.AverageUnitCost).isNeg();
    const className = {
        'd-block': ltZero || ltCost,
        'bg-danger': ltZero,
        'bg-warning': !ltZero && ltCost,
        'text-light': ltZero,
        'text-dark': !ltZero && ltCost,
        // 'p-1': ltZero || ltCost
    };
    return (
        <span className={classNames(className)}>
            {(ltZero || ltCost) && <span className="bi-exclamation-triangle-fill me-1"/>}
            {calculatePrice(priceCode, item, display).toFixed(2)}
        </span>
    )
}
export default React.memo(ItemDiscountedPrice);
