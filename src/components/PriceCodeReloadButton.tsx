import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectCurrentPriceCode, selectCurrentPriceCodeLoading, setCurrentPriceCode} from "../ducks/pricing";
import {SpinnerButton} from "chums-components";

const PriceCodeReloadButton = () => {
    const dispatch = useAppDispatch();
    const priceCode = useAppSelector(selectCurrentPriceCode);
    const loading = useAppSelector(selectCurrentPriceCodeLoading);

    const clickHandler = () => {
        dispatch(setCurrentPriceCode(priceCode));
    }
    return (
        <SpinnerButton spinning={loading} color="primary" size="sm" onClick={clickHandler}>Reload</SpinnerButton>
    )
}

export default PriceCodeReloadButton;
