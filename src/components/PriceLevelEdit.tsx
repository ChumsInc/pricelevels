import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {
    saveCurrentPriceLevel,
    selectCurrentPriceLevel,
    selectCurrentPriceLevelLoading,
    updatePriceLevel
} from "../ducks/pricing";
import {ChangeEvent, FormEvent, memo} from "react";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {PriceLevel} from "chums-types";
import PriceLevelCustomers from "./PriceLevelCustomers";
import {postPriceLevel} from "../ducks/pricing/api";

const PriceLevelEdit = () => {
    const dispatch = useAppDispatch();
    const priceLevel = useAppSelector(selectCurrentPriceLevel);
    const loading = useAppSelector(selectCurrentPriceLevelLoading);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (priceLevel) {
            dispatch(saveCurrentPriceLevel(priceLevel));
        }
    }

    const changeHandler = (field: keyof PriceLevel) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updatePriceLevel({[field]: ev.target.value}));
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <FormColumn label="Price Level" width={8}>
                    <div className="row g-3">
                        <div className="col-auto">
                            <input type="text" minLength={1} maxLength={1} required
                                   className="form-control form-control-sm"
                                   readOnly={!!priceLevel?.customers || !!priceLevel?.priceCodes}
                                   value={priceLevel?.PriceLevel || ''} onChange={changeHandler('PriceLevel')}/>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control form-control-sm" required
                                   value={priceLevel?.PriceLevelDescription || ''}
                                   onChange={changeHandler('PriceLevelDescription')}/>
                        </div>
                    </div>
                </FormColumn>
                <FormColumn label="" width={8}>
                    <SpinnerButton spinning={loading} color="primary" type="submit" size="sm">Save</SpinnerButton>
                </FormColumn>
            </form>
            <FormColumn label="Usage" width={8}>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Price Codes</th>
                        <th>Customers</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{priceLevel?.priceCodes || '0'}</td>
                        <td>{priceLevel?.customers || '0'}</td>
                    </tr>
                    </tbody>
                </table>
            </FormColumn>
            <Alert color="info" title="Hint">
                To update a customer's <strong>Price Level</strong> use "Customer Maintenance, Tab 2 <em>(Additional)</em>.
            </Alert>
            <FormColumn label="Customers" width={8}>
                <PriceLevelCustomers/>
            </FormColumn>
        </div>
    )
}

export default memo(PriceLevelEdit);
