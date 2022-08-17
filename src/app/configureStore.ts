import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {alertsReducer, pageSetsReducer, tablesReducer, tabsReducer} from "chums-connected-components";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {default as pricingReducer} from '../ducks/pricing';
// import {default as warehouseReducer} from '../ducks/warehouse';
// import {default as itemsReducer} from '../ducks/items';


const rootReducer = combineReducers({
    alerts: alertsReducer,
    // items: itemsReducer,
    pageSets: pageSetsReducer,
    pricing: pricingReducer,
    tables: tablesReducer,
    tabs: tabsReducer,
    // warehouse: warehouseReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
