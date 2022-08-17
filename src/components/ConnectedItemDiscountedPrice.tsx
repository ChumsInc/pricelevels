import {PriceCodeItem} from "chums-types";
import {useAppSelector} from "../app/configureStore";
import {selectCurrentPriceCode} from "../ducks/pricing/selectors";
import ItemDiscountedPrice from "./ItemDiscountedPrice";

export interface ItemDiscountedPriceProps {
    item: PriceCodeItem;
    display: 'current-price' | 'next-price'
}

const ConnectedItemDiscountedPrice = ({item, display}: ItemDiscountedPriceProps) => {
    const priceCode = useAppSelector(selectCurrentPriceCode);
    return (<ItemDiscountedPrice item={item} priceCode={priceCode} display={display}/>)
}
export default ConnectedItemDiscountedPrice;
