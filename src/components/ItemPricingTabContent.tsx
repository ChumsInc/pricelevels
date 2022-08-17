import PriceCodeSelect from "./PriceCodeSelect";
import {ChangeEvent, useEffect, useState} from "react";
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentPriceCode, selectCurrentPriceCodeLevels, selectPriceLevels} from "../ducks/pricing/selectors";
import PriceCodeReloadButton from "./PriceCodeReloadButton";
import FilterInput from "./FilterInput";
import {PriceCodeChange, PriceCodeItem, PriceLevel} from "chums-types";
import PriceLevelSelect from "./PriceLevelSelect";
import ItemPricingTable from "./ItemPricingTable";
import ColumnSelector from "./ColumnSelector";
import PriceCodeDiscountEdit from "./PriceCodeDiscountEdit";

const ItemPricingTabContent = () => {
    const dispatch = useAppDispatch();
    const [filter, setFilter] = useState('');
    const priceCode = useSelector(selectCurrentPriceCode);
    const priceLevels = useSelector(selectPriceLevels);
    const priceCodeLevels = useSelector(selectCurrentPriceCodeLevels)

    const [item, setItem] = useState<PriceCodeItem | null>(null);
    const [levelPriceCode, setLevelPriceCode] = useState<PriceCodeChange|null>(null);
    const [priceLevel, setPriceLevel] = useState<PriceLevel|null>(null);

    useEffect(() => {
        setItem(null);
    }, [priceCode?.PriceCode]);

    useEffect(() => {
        if (levelPriceCode) {
            setLevelPriceCode(priceCodeLevels[levelPriceCode.CustomerPriceLevel]);
        }
    }, [priceCodeLevels])

    const priceLevelHelper = (code:string) => {
        if (!priceLevels[code]) {
            return;
        }
        const pc = priceCodeLevels[code] || {...priceCode, CustomerPriceLevel: code, DiscountMarkup1: 0, newDiscountMarkup1: 0, hasChange: false};
        setLevelPriceCode(pc);

    }
    const priceLevelChangeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        priceLevelHelper(ev.target.value)
    }

    const clickPriceLevelHandler = (pl:string) => {
        priceLevelHelper(pl);
    }

    return (
        <div>
            <div className="row g-3 mb-1 align-items-baseline">
                <div className="col-auto">
                    <PriceCodeSelect/>
                </div>
                <div className="col-auto">
                    <PriceCodeReloadButton/>
                </div>
                <div className="col-auto">
                    <FilterInput value={filter} onChange={(ev) => setFilter(ev.target.value)}
                                 placeholder="Filter Items"/>
                </div>
                <div className="col-auto">
                    <PriceLevelSelect priceLevels={priceLevels} value={levelPriceCode?.CustomerPriceLevel || ''} onChange={priceLevelChangeHandler} />
                </div>
                <PriceCodeDiscountEdit priceCode={levelPriceCode} item={item}/>
                <div className="col" />
                <div className="col-auto">
                    <ColumnSelector />
                </div>
            </div>
            <ItemPricingTable item={item} onSelectRow={(item) => setItem(item)} filter={filter} onSelectPriceLevel={clickPriceLevelHandler} />
        </div>
    )
}

export default ItemPricingTabContent;
