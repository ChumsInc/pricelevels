import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {PriceLevelVisibility, PriceLevelVisibilityList} from "./types";

export const selectPriceLevels = (state: RootState) => state.pricing.priceLevels.list;
export const selectPriceLevelsLoading = (state: RootState) => state.pricing.priceLevels.loading === 'pending';
export const selectPriceLevelsLoaded = (state: RootState) => state.pricing.priceLevels.loaded;
export const selectCurrentPriceLevel = (state: RootState) => state.pricing.priceLevels.current.priceLevel;
export const selectCurrentPriceLevelLoading = (state: RootState) => state.pricing.priceLevels.current.loading === 'pending';
export const selectCurrentPriceLevelCodes = (state:RootState) => state.pricing.priceLevels.current.priceCodes;
// export const selectCurrentPriceLevelCodes = (state: RootState) => state.pricing.priceLevels.selected.priceCodes;
export const selectPriceLevelCustomers = (state: RootState) => state.pricing.priceLevels.current.customers;

export const selectPriceCodes = (state: RootState) => state.pricing.priceCodes.list;
export const selectPriceCodesLoading = (state: RootState) => state.pricing.priceCodes.loading === 'pending';
export const selectPriceCodesLoaded = (state: RootState) => state.pricing.priceCodes.loaded;
export const selectCurrentPriceCode = (state: RootState) => state.pricing.priceCodes.current.priceCode;
export const selectPriceCodeItems = (state: RootState) => state.pricing.priceCodes.current.items;
export const selectCurrentPriceCodeLoading = (state: RootState) => state.pricing.priceCodes.current.loading === 'pending';
export const selectCurrentPriceCodeLevels = (state: RootState) => state.pricing.priceCodes.current.levels;

export const selectUsers = (state: RootState) => state.pricing.changes.users;
export const selectCurrentUser = (state: RootState) => state.pricing.changes.currentUser;
export const selectChanges = (state: RootState) => state.pricing.changes.changes;
export const selectUserChangesLoading = (state: RootState) => state.pricing.changes.loading === 'pending';
