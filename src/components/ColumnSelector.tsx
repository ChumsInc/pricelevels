import {useAppSelector} from "../app/configureStore";
import {selectPriceLevels} from "../ducks/pricing";
import Dropdown from 'react-bootstrap/Dropdown';
import ColumnVisibiltyToggle from "./ColumVisibilityToggle";
import {memo} from "react";
import {priceLevelSort} from "../ducks/pricing/utils";

const ColumnSelector = () => {
    const priceLevels = useAppSelector(selectPriceLevels);
    const visible = Object.values(priceLevels).filter(pl => !pl.hidden).length;
    const count = Object.values(priceLevels).length;

    return (
        <Dropdown autoClose="outside">
            <Dropdown.Toggle size="sm">
                Select Columns ({visible}/{count})
            </Dropdown.Toggle>
            <Dropdown.Menu style={{maxHeight: '50vh', overflow: 'auto'}}>
                {Object.values(priceLevels)
                    .sort(priceLevelSort)
                    .map(pl => (
                    <Dropdown.Item key={pl.PriceLevel}>
                        <ColumnVisibiltyToggle priceLevel={pl.PriceLevel}/>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}
export default memo(ColumnSelector);
