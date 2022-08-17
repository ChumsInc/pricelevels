/**
 * Created by steve on 8/24/2016.
 */

import React, {ChangeEvent} from 'react';
import {PriceLevelList} from "../ducks/pricing/types";
import {priceLevelSort} from "../ducks/pricing/utils";


export interface PriceLevelSelectProps {
    priceLevels: PriceLevelList,
    value: string,
    onChange:(ev:ChangeEvent<HTMLSelectElement>) => void;
}
const PriceLevelSelect = ({priceLevels, value, onChange}:PriceLevelSelectProps) => {
    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">Customer Level</div>
            <select className="form-select form-select-sm" value={value} onChange={onChange}>
                <option value="">No Price Level</option>
                {Object.values(priceLevels)
                    .sort(priceLevelSort)
                    .map(pl => (
                        <option key={pl.PriceLevel} value={pl.PriceLevel}>
                            {pl.PriceLevel} : {pl.PriceLevelDescription}
                        </option>
                    ))}
            </select>
        </div>
    )
}

export default React.memo(PriceLevelSelect);
