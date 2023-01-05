import React, {useEffect, useState} from 'react';
import {Tab, TabList, TabItem, SessionStore, ErrorBoundary} from 'chums-components';
import {useAppDispatch} from "./configureStore";
import {useSelector} from "react-redux";
import {
    loadPriceCodes,
    loadPriceLevels,
    selectPriceCodesLoaded,
    selectPriceCodesLoading,
    selectPriceLevelsLoaded,
    selectPriceLevelsLoading
} from "../ducks/pricing";
import PriceCodesTabContent from "../components/PriceCodesTabContent";
import ItemPricingTabContent from "../components/ItemPricingTabContent";
import PriceLevelTabContent from "../components/PriceLevelTabContent";
import UserChangesTabContent from "../components/UserChangesTabContent";
import {sessionStorageTabKey} from "../constants";


const tabPriceCodes:Tab = {
    id: 'price-codes',
    title: 'Price Codes',
}
const tabPriceList:Tab = {
    id: 'price-list',
    title: 'Item Pricing List',
}
const tabChanges:Tab = {
    id: 'price-changes',
    title: 'Pricing Changes',
}
const tabPriceLevels:Tab = {
    id: 'price-levels',
    title: 'Customer Price Levels'
}

const tabs:Tab[] = [
    tabPriceLevels,
    tabPriceList,
    tabPriceCodes,
    tabChanges,
];

const App = () => {
    const dispatch = useAppDispatch();
    const plLoading = useSelector(selectPriceLevelsLoading);
    const plLoaded = useSelector(selectPriceLevelsLoaded);
    const pcLoading = useSelector(selectPriceCodesLoading);
    const pcLoaded = useSelector(selectPriceCodesLoaded);
    const [tab, setTab] = useState(SessionStore.getItem(sessionStorageTabKey) ?? tabPriceCodes.id);


    useEffect(() => {
        if (!plLoaded && !plLoading) {
            dispatch(loadPriceLevels());
        }
        if (!pcLoaded && !pcLoading) {
            dispatch(loadPriceCodes());
        }
    }, [])

    const onChangeTab = (tab:Tab) => {
        SessionStore.setItem(sessionStorageTabKey, tab.id);
        setTab(tab.id);
    }

    return (
        <div>
            <TabList tabs={tabs} currentTabId={tab} onSelectTab={onChangeTab} />
            <div>
                <ErrorBoundary>
                    {tab === tabPriceLevels.id && (
                        <PriceLevelTabContent />
                    )}
                    {tab === tabPriceList.id && (
                        <ItemPricingTabContent />
                    )}
                    {tab === tabPriceCodes.id && (
                        <PriceCodesTabContent />
                    )}
                    {tab === tabChanges.id && (
                        <UserChangesTabContent />
                    )}
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default App;
