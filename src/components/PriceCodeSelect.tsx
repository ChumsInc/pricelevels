import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentPriceCode, selectPriceCodes, setCurrentPriceCode} from "../ducks/pricing";
import {ChangeEvent} from "react";

const PriceCodeSelect = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectPriceCodes);
    const current = useSelector(selectCurrentPriceCode);

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentPriceCode(list[ev.target.value]));
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">Price Code</div>
            <select className="form-select form-select-sm" value={current?.PriceCode || ''} onChange={changeHandler}>
                <option value="">Select Price Code</option>
                {Object.keys(list).sort()
                    .map(key => (<option value={key} key={key}>{key}: {list[key].PriceCodeDesc}</option>))}
            </select>
        </div>
    )
}

export default PriceCodeSelect;
