import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectPriceLevels, setPLVisibility} from "../ducks/pricing";
import {ChangeEvent, memo, useEffect, useState} from "react";
import {EditablePriceLevel, PriceLevelVisibilityList} from "../ducks/pricing/types";
import {SessionStore} from "chums-components";
import {sessionStorageVisibilityKey} from "../constants";

export interface ColumnVisibilityToggleProps {
    priceLevel: string
}

const ColumnVisibiltyToggle = ({priceLevel}: ColumnVisibilityToggleProps) => {
    const dispatch = useAppDispatch();
    const priceLevels = useAppSelector(selectPriceLevels);
    const [pl, setPL] = useState<EditablePriceLevel|null>(priceLevels[priceLevel] ?? null);

    useEffect(() => {
        const pl = priceLevels[priceLevel] ?? null;
        setPL(pl);
    }, [priceLevel, priceLevels]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (pl) {
            const visible:PriceLevelVisibilityList = SessionStore.getItem(sessionStorageVisibilityKey) || {};
            visible[pl.PriceLevel] = {PriceLevel: pl.PriceLevel, hidden: !ev.target.checked};
            SessionStore.setItem(sessionStorageVisibilityKey, visible);
            dispatch(setPLVisibility(pl.PriceLevel, !ev.target.checked));
        }
    }


    if (!pl) {
        return (
            <div>undefined '{priceLevel}'</div>
        )
    }

    const id = `column-selector--${pl.PriceLevel}`;
    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input" checked={!pl.hidden}
                   onChange={changeHandler} id={id}/>
            <label className="form-check-label"
                   htmlFor={id}>{pl.PriceLevel} - {pl.PriceLevelDescription || '---'}</label>
        </div>
    )
}

export default memo(ColumnVisibiltyToggle);
