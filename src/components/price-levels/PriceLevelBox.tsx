import {EditablePriceLevel} from "../../ducks/pricing/types";
import React, {FC, memo} from "react";

export interface PriceLevelBoxProps {
    level: EditablePriceLevel,
    moving?: boolean,
}

const PriceLevelBox: FC<PriceLevelBoxProps> = ({level, moving}) => {
    return (
        <div>
            <div>
                <strong>{level.PriceLevel}</strong>
            </div>
            <div><small>{level.PriceLevelDescription || '---'}</small></div>
        </div>
    )
}

export default memo(PriceLevelBox);
