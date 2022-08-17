import {useAppSelector} from "../app/configureStore";
import {selectCurrentPriceCode, selectCurrentPriceLevel} from "../ducks/pricing";
import PriceLevelItemsTable from "./PriceLevelItemsTable";
import {useEffect, useState} from "react";
import {PriceCodeItem} from "chums-types";
import PriceCodeDiscountEdit from "./PriceCodeDiscountEdit";



const PriceLevelItems = () => {
    const priceLevel = useAppSelector(selectCurrentPriceLevel);
    const priceCode = useAppSelector(selectCurrentPriceCode);
    const [item, setItem] = useState<PriceCodeItem | null>(null);

    useEffect(() => {
        setItem(null);
    }, [priceCode?.PriceCode]);


    return (
        <div>
            {!!priceCode && (
                <h3>Price Code {priceCode?.PriceCode}, {priceLevel?.PriceLevelDescription ?? 'No Discount'}</h3>)}
            {!priceCode && <h3>No price code selected</h3>}
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <label>Current Discount: <strong>{priceCode?.DiscountMarkup1 || '0'} %</strong></label>
                </div>
                {!!priceLevel && <PriceCodeDiscountEdit priceCode={priceCode} item={item}/>}
            </div>
            <PriceLevelItemsTable item={item} onSelectRow={(item) => setItem(item)}/>
        </div>
    )
}

export default PriceLevelItems;
