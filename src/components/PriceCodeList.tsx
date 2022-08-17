import {useAppDispatch} from "../app/configureStore";
import {selectCurrentPriceLevel, selectPriceCodesLoading, setCurrentPriceLevel} from "../ducks/pricing";
import {useState} from "react";
import {useSelector} from "react-redux";
import {SpinnerButton, ToggleButton} from "chums-components";
import PriceCodesTable from "./PriceCodesTable";
import FilterInput from "./FilterInput";
import ConnectedPriceLevelSelect from "./ConnectedPriceLevelSelect";

const PriceCodeList = () => {
    const dispatch = useAppDispatch();
    const priceLevel = useSelector(selectCurrentPriceLevel);
    // const priceCodes = useAppSelector(selectCurrentPriceLevelCodes);
    const priceLevelLoading = useSelector(selectPriceCodesLoading);
    const [filter, setFilter] = useState('');
    const [filterChanged, setFilterChanged] = useState(false);

    const reloadHandler = () => {
        dispatch(setCurrentPriceLevel(priceLevel));
    }

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">
                    <ConnectedPriceLevelSelect/>
                </div>
                <div className="col-auto">
                    <FilterInput value={filter} onChange={(ev) => setFilter(ev.target.value)}
                                 placeholder="Filter Price Codes"/>
                </div>
                <div className="col-auto">
                    <SpinnerButton type="button" size="sm" className="btn btn-primary" onClick={reloadHandler}
                                   spinning={priceLevelLoading}>
                        Reload
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <ToggleButton id={'pl--filter-changed'} color="secondary" size="sm" checked={filterChanged}
                                  onClick={() => setFilterChanged(!filterChanged)}>
                        Filter Changed
                    </ToggleButton>
                </div>
            </div>
            <div>
                <PriceCodesTable filter={filter} filterChanged={filterChanged}/>
            </div>
        </div>
    )
}
export default PriceCodeList;
