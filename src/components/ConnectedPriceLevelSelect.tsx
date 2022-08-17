import React, {ChangeEvent} from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentPriceLevel, selectPriceLevels} from "../ducks/pricing/selectors";
import PriceLevelSelect from "./PriceLevelSelect";
import {setCurrentPriceLevel} from "../ducks/pricing/actions";


const ConnectedPriceLevelSelect = () => {
    const dispatch = useAppDispatch();
    const priceLevels = useSelector(selectPriceLevels);
    const currentPriceLevel = useSelector(selectCurrentPriceLevel);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const pl = priceLevels[ev.target.value];
        dispatch(setCurrentPriceLevel(pl));
    }
    return (
        <PriceLevelSelect priceLevels={priceLevels} value={currentPriceLevel?.PriceLevel || ''}
                          onChange={changeHandler}/>
    )
}

export default ConnectedPriceLevelSelect;
