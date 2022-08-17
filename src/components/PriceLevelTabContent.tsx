import PriceLevelDNDProvider from "./price-levels/PriceLevelDNDProvider";
import PriceLevelEdit from "./PriceLevelEdit";
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {loadPriceLevels, selectPriceLevelsLoading} from "../ducks/pricing";
import {SpinnerButton} from "chums-components";

const PriceLevelTabContent = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectPriceLevelsLoading);
    const reloadHandler = () => {
        dispatch(loadPriceLevels());
    }
    return (
        <div className="row g-3">
            <div className="col-6">
                <div style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div><h3>Customer Price Levels</h3></div>
                    <div>

                    </div>
                </div>
                <PriceLevelDNDProvider />
            </div>
            <div className="col-6">
                <PriceLevelEdit />
            </div>
        </div>
    )
}

export default PriceLevelTabContent;
