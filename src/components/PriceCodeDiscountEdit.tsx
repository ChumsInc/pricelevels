import {PriceCodeItem} from "chums-types";
import {ChangeEvent, useEffect, useState} from "react";
import {savePriceCode, setPriceCodeLevelDiscount} from "../ducks/pricing";
import {calculatePrice} from "../ducks/pricing/utils";
import Decimal from "decimal.js";
import {useAppDispatch} from "../app/configureStore";
import {EditablePriceCodeChange} from "../ducks/pricing/types";

export interface PriceCodeItemPricingProps {
    priceCode: EditablePriceCodeChange | null;
    item: PriceCodeItem | null;
}

const PriceCodeDiscountEdit = ({priceCode, item}: PriceCodeItemPricingProps) => {
    const dispatch = useAppDispatch();
    const [price, setPrice] = useState<string>('');

    useEffect(() => {
        if (!item) {
            setPrice('');
            return;
        }

        const nextPrice = calculatePrice(priceCode, item).toFixed(2);
        setPrice(nextPrice);
    }, [priceCode?.PriceCode, priceCode?.CustomerPriceLevel, item?.ItemCode]);

    const discountChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (!priceCode?.CustomerPriceLevel) {
            return;
        }
        dispatch(setPriceCodeLevelDiscount(priceCode?.CustomerPriceLevel, ev.target.valueAsNumber || 0));

        if (!!ev.target.value && !!item) {
            const nextPrice = calculatePrice(priceCode, item).toFixed(2);
            setPrice(nextPrice);
        }
    }
    const priceChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (!item || !priceCode) {
            return;
        }
        setPrice(ev.target.value);
        if (ev.target.value === '') {
            return dispatch(setPriceCodeLevelDiscount(priceCode?.CustomerPriceLevel, priceCode.DiscountMarkup1));
        }
        const discount = new Decimal(1).sub(new Decimal(ev.target.valueAsNumber || 0).div(item.StandardUnitPrice)).times(100).toDecimalPlaces(3);
        dispatch(setPriceCodeLevelDiscount(priceCode?.CustomerPriceLevel, discount.toNumber()));
    }

    const savePriceChangeHandler = () => {
        if (!priceCode) {
            return;
        }
        dispatch(savePriceCode(priceCode));
    }

    return (
        <>
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <span className="input-group-text">New Discount</span>
                    <input type="number" className="form-control form-control-sm" disabled={!priceCode}
                           value={priceCode?.newDiscountMarkup1 ?? '0'} step={0.001} min={0} max={100}
                           onChange={discountChangeHandler}/>
                    <span className="input-group-text">%</span>
                </div>
            </div>
            {!!priceCode && !!item && (
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <span className="input-group-text">$</span>
                        <input type="number" className="form-control form-control-sm" disabled={!priceCode}
                               value={price} step={0.01} min={0}
                               onChange={priceChangeHandler}/>
                    </div>
                </div>
            )}
            <div className="col-auto">
                <button className="btn btn-sm  btn-primary" disabled={!priceCode || !priceCode.changed}
                        onClick={savePriceChangeHandler}>
                    Save
                </button>
            </div>
        </>
    )
}

export default PriceCodeDiscountEdit;
