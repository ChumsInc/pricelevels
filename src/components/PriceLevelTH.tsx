import {PriceCodeChange, PriceLevel, PricingMethod} from "chums-types";
import classNames from "classnames";
import React, {ChangeEvent, ReactNode} from "react";
import {EditablePriceCodeChange} from "../ducks/pricing/types";

const priceMod = (priceCode:PriceCodeChange|null):ReactNode => {
    switch (priceCode?.PricingMethod) {
    case 'C':
        return `cost + $${priceCode.DiscountMarkup1}`;
    case 'D':
        return `- ${priceCode.DiscountMarkup1}%`
    case 'M':
        return `+ ${priceCode.DiscountMarkup1}%`;
    case 'P':
        return `- $${priceCode.DiscountMarkup1}`
    case 'O':
        return `= $${priceCode.DiscountMarkup1}`;
    default:
        return <span>&nbsp;</span>;
    }
}

export interface PriceLevelTHProps {
    priceCode: EditablePriceCodeChange | null;
    priceLevel: PriceLevel,
    onChangeDiscount: (ev: ChangeEvent<HTMLInputElement>) => void,
    onSelectPriceLevel: (level: string) => void;
}

const PriceLevelTH = ({priceCode, priceLevel, onChangeDiscount, onSelectPriceLevel}: PriceLevelTHProps) => {
    const bgSuccess = priceCode?.hasChange === false && !priceCode?.changed;
    const bgInfo = priceCode?.hasChange && !priceCode?.changed;
    const bgWarning = priceCode?.changed;
    const inputClassName = {
        'bg-success': bgSuccess,
        'bg-info': bgInfo,
        'bg-warning': bgWarning,
        'text-dark': bgWarning || !(bgSuccess || bgInfo),
        'text-light': bgSuccess || bgInfo,
    }
    return (
        <th className="text-center" key={priceLevel.PriceLevel}
            onClick={() => onSelectPriceLevel(priceLevel.PriceLevel)}>
            <div>{priceLevel.PriceLevel}</div>
            <small>{priceLevel.PriceLevelDescription || '---'}</small>
            <div className="text-primary">{priceMod(priceCode)}</div>
            <div className="input-group input-group-sm bg-light">
                <input type="number" className={classNames("form-control form-control-sm text-center", inputClassName)}
                       value={(priceCode?.newDiscountMarkup1 ?? priceCode?.DiscountMarkup1) ?? ''}
                       onChange={onChangeDiscount}
                />
            </div>
        </th>
    )
}
export default PriceLevelTH;
