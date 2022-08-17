import PriceCodeList from "./PriceCodeList";
import PriceLevelItems from "./PriceLevelItems";

const PriceCodesTabContent = () => {
    return (
        <div className="row g-3">
            <div className="col-6">
                <PriceCodeList />
            </div>
            <div className="col-6">
                <PriceLevelItems />
            </div>
        </div>
    )
}

export default PriceCodesTabContent;
