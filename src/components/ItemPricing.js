/**
 * Created by steve on 8/29/2016.
 */

import React from 'react';
import classNames from 'classnames';
import CompanySelect from './CompanySelect';
import PriceCodeSelect from './PriceCodeSelect';
import PriceLevelSelect from './PriceLevelSelect';
import {priceCalc} from '../utils';
import {connect} from 'react-redux';
import {
    clearError,
    fetchPriceCodes, savePriceCodeChanges, selectPriceCode, setCompany, setNewPriceCodeLevelsDiscount, setPriceLevel
} from "../actions/priceCodes";
import numeral from 'numeral';
import ProgressBar from "../components/ProgressBar";
import DismissableAlert from "./DismissableAlert";

class ItemPricing extends React.Component {
    constructor() {
        super();

        this.state = {
            filter: '',
            selectedItem: {},
            fromPrice: 0,
        }
    }

    componentDidMount() {
        this.loadPriceCodes();
    }

    changeCompany(company) {
        this.props.dispatch(setCompany(company));
        this.loadPriceCodes();
    }

    changeItemFilter(ev) {
        this.setState({filter: ev.target.value});
    }

    changePriceCode(pc) {
        const {dispatch, list} = this.props;
        dispatch(selectPriceCode(list[pc]));
    }

    loadPriceCodes(callback) {
        this.props.dispatch(fetchPriceCodes());
    }

    changePriceLevel(level) {
        this.props.dispatch(setPriceLevel(level));
    }

    setNewDiscountFromPrice(ev) {
        let fromPrice = ev.target.value;
        const {priceCodeLevels, priceLevel} = this.props;

        this.setState({fromPrice});
        const markup = fromPrice === ''
            ? (priceCodeLevels[priceLevel] || {}).DiscountMarkup1
            : (1 - (fromPrice / this.state.selectedItem.StandardUnitPrice)) * 100;
        this.props.dispatch(setNewPriceCodeLevelsDiscount(numeral(markup).format('0.000'), priceLevel));
    }

    changeDiscountMarkup(level, ev) {
        this.props.dispatch(setNewPriceCodeLevelsDiscount(ev.target.value, level));
    }

    price(stdPrice, discountMarkup, method) {
        if (!method || !priceCalc[method]) {
            return stdPrice;
        }
        return priceCalc[method](stdPrice, discountMarkup);
    }

    handleSubmit(ev) {
        ev.preventDefault();
        return false;
    }

    onSelectItem(selectedItem) {
        this.setState({selectedItem});
    }

    onSaveChanges(ev) {
        ev.preventDefault();
        this.props.dispatch(savePriceCodeChanges());
    }

    onDismissError(index) {
        this.props.dispatch(clearError(index));
    }

    renderTable() {
        const {priceCodeLevels, selected, levels, items, loadingItems} = this.props;
        const plKeys = Object.keys(levels);
        const itemFilter = new RegExp(this.state.filter, 'i');
        let thCols = plKeys
            .map(pl => {
                let level = {
                    DiscountMarkup1: 0,
                    ...priceCodeLevels[pl]
                };

                const newLevel = level.changed !== true && level.newDiscountMarkup !== undefined
                    && level.newDiscountMarkup !== null
                    && level.newDiscountMarkup !== level.DiscountMarkup1;

                const liveLevel = (level.newDiscountMarkup === undefined || level.newDiscountMarkup === null)
                    && level.DiscountMarkup1 !== undefined && level.DiscountMarkup1 !== 0;

                let css = {
                    'bg-warning': level.changed,
                    'bg-info': newLevel,
                    'bg-success':  liveLevel,
                    'text-white': liveLevel || newLevel,
                };

                const value = level.newDiscountMarkup || level.DiscountMarkup1;
                return (
                    <th className="center" key={'th-' + pl}>
                        {pl}
                        <br/>
                        <input type="number" className={classNames("form-control form-control-sm right", css)}
                               placeholder="0.000"
                               value={value || ''}
                               onChange={this.changeDiscountMarkup.bind(this, pl)}/>

                    </th>
                )
            });

        let body = items
            .filter(item => {
                return this.state.filter === '' || itemFilter.test(item.ItemCode);
            })
            .map(item => {
                let plCols = plKeys.map(pl => {
                    const level = {newDiscountMarkup: '', ...priceCodeLevels[pl]};
                    let price = this.price(item.StandardUnitPrice, level.newDiscountMarkup || level.DiscountMarkup1, level.PricingMethod);
                    let css = classNames({
                        right: true,
                        'no-disc': (level.DiscountMarkup1 === '' || level.DiscountMarkup1 === 0) && !level.newDiscountMarkup,
                        info: level.newDiscountMarkup !== undefined
                            && level.newDiscountMarkup !== level.DiscountMarkup1,
                        'bg-warning': item.ItemCode === this.state.selectedItem.ItemCode && pl === this.props.priceLevel
                    });
                    return (
                        <td className={css} key={item.ItemCode + '-' + pl}
                            onClick={this.changePriceLevel.bind(this, pl)}>
                            {numeral(price).format('0.00')}
                        </td>
                    );
                });

                return (
                    <tr key={item.ItemCode} onClick={this.onSelectItem.bind(this, item)}>
                        <td>{item.ItemCode}</td>
                        <td>{item.StandardUnitOfMeasure}</td>
                        <td className="right">{numeral(item.StandardUnitPrice).format('0.00')}</td>
                        {plCols}
                    </tr>
                );
            });

        const progressBar = loadingItems
            ? (
                <tr>
                    <th colSpan={3 + plKeys.length}>
                        <ProgressBar active={true} visible={loadingItems} striped={true}/>
                    </th>
                </tr>
            )
            : null;

        return (
            <table className="table table-hover pricing-table table-sm sticky">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>U/M</th>
                        <th className="center">Std Price</th>
                        {thCols}
                    </tr>
                    {progressBar}
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        )
    }

    render() {
        const {company, list, selected, levels, priceLevel, loading, errors } = this.props;
        const {selectedItem, fromPrice} = this.state;

        const alerts = errors.map((error, index) => {
            return (
                <DismissableAlert key={index} message={error} onDismiss={this.onDismissError.bind(this, index)}/>
            )
        });

        const table = this.renderTable();
        return (
            <div>
                {alerts}
                <form className="form-inline" onSubmit={::this.handleSubmit}>
                    <div className="form-group mx-sm-1">
                        <CompanySelect value={company} onChange={::this.changeCompany} />
                    </div>
                    <div className="form-group mx-sm-1">
                        <PriceCodeSelect priceCodes={list} priceCode={selected || {}}
                                         onChange={::this.changePriceCode}/>
                    </div>
                    <div className="form-group mx-sm-1">
                        <input type="text" placeholder="filter items" value={this.state.filter} className="form-control form-control-sm"
                               onChange={this.changeItemFilter.bind(this)} />
                    </div>
                    <div className="form-group mx-sm-1">
                        <label>Set Price</label>
                        <PriceLevelSelect company={company}
                                          value={priceLevel}
                                          values={levels}
                                          onChange={::this.changePriceLevel}/>
                        <input type="number" value={fromPrice || ''} className="form-control form-control-sm" placeholder="0.00"
                               onChange={::this.setNewDiscountFromPrice}
                               disabled={priceLevel === '' || !selectedItem.StandardUnitPrice} />
                    </div>
                    <div className="form-group mx-sm-3">
                        <button type="button" className="btn btn-primary btn-sm" onClick={::this.onSaveChanges}>Save Changes</button>
                    </div>
                </form>
                <ProgressBar active={true} visible={loading} striped={true}/>
                <div className="my-sm-1">
                    Legend:{' '}
                    <button className="btn btn-success btn-sm mx-sm-1">Live</button>
                    <button className="btn btn-info btn-sm mx-sm-1">Saved</button>
                    <button className="btn btn-warning btn-sm mx-sm-1">Changed</button>
                </div>
                {table}
            </div>
        )
    }
}


const mapStateToProps = state => {
    const { company, list, selected, levels, priceLevel, priceCodeLevels, errors, loading, items, loadingItems, } = state.priceCodes;
    return { company, loading, list, errors, priceLevel, items, selected, loadingItems, priceCodeLevels, levels };
};

export default connect(mapStateToProps)(ItemPricing);
