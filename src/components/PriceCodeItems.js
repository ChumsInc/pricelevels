/**
 * Created by steve on 8/24/2016.
 */
import React from 'react';
import classNames from 'classnames';
// import debounce from 'lodash.debounce';
import { priceCalc } from '../utils';
import numeral from 'numeral';
import PropTypes from 'proptypes';

const defaultPriceCode = {
    PriceCode: '',
    PriceCodeDesc: '',
    PriceCodeRecord: '0',
    CustomerPriceLevel: '',
    PricingMethod: 'D',
    BreakQuantity1: 99999999,
    DiscountMarkup1: 0,
    newDiscountMarkup: '',
    UserName: ''
};

const defaultItem = {
    ItemCode: '',
    ItemCodeDesc: '',
    ProductType: '',
    StandardUnitOfMeasure: '',
    StandardUnitPrice: 0,
    SuggestedRetailPrice: 0,
    newStandardPrice: 0
};

export default class PriceCodeItems extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired,
        priceCode: PropTypes.any,
        priceLevel: PropTypes.string.isRequired,
    };

    constructor() {
        super();
        this.state = {
            newDiscountMarkup: 0,
            valid: true,
            item: defaultItem,
            fromPrice: '',
            selected: '',
            changed: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            item: defaultItem,
            changed: false,
            newDiscountMarkup: (nextProps.priceCode || {}).newDiscountMarkup,
        });
    }

    setNewDiscountMarkup(value) {
        this.setState({
            newDiscountMarkup: value,
            changed: true,
        });
    }

    setNewDiscount(ev) {
        const newDiscountMarkup = ev.target.value;
        this.setNewDiscountMarkup(newDiscountMarkup);
        if (this.state.item.ItemCode) {
            this.setState({fromPrice: this.price(this.state.item.StandardUnitPrice, newDiscountMarkup).toFixed(2)});
        }
    }

    setNewDiscountFromPrice(ev) {
        let fromPrice = ev.target.value,
            valid = true || parseFloat(fromPrice).toString() === fromPrice.replace(/(\.[0-9]*[1-9]*)[0]+$|\.$/, '$1');

        this.setState({fromPrice});

        if (valid) {
            const markup = fromPrice === ''
                ? (this.state.DiscountMarkup1 || 0)
                : (1 - ((fromPrice || 0) / this.state.item.StandardUnitPrice)) * 100;
            this.setNewDiscountMarkup(markup.toFixed(3).toString());
        }
    }

    saveDiscount() {
        this.props.onChange(
            this.state.newDiscountMarkup === ''
                ? ''
                : parseFloat(this.state.newDiscountMarkup)
        );
    }

    price(stdPrice, discountMarkup) {
        const method = this.props.priceCode.PricingMethod;
        if (!method || !priceCalc[method]) {
            return stdPrice;
        }
        return priceCalc[method](
            stdPrice,
            discountMarkup === '' ? this.props.priceCode.DiscountMarkup1 : discountMarkup
        );
    }

    setItem(item) {
        this.setState({
            item: {...defaultItem, ...item}
        });
    }

    renderItemList() {
        let rows = this.props.items.map(item => {
            const oldPrice = this.price(item.StandardUnitPrice, this.props.priceCode.DiscountMarkup1);
            const newPrice = this.price(item.StandardUnitPrice, this.state.newDiscountMarkup);
            return (
                <tr key={item.ItemCode}
                    onClick={this.setItem.bind(this, item)}
                    className={classNames({'table-info': item.ItemCode === this.state.item.ItemCode})}>
                    <td>{item.ItemCode}</td>
                    <td>{item.ItemCodeDesc}</td>
                    <td>{item.ProductType}</td>
                    <td>{item.StandardUnitOfMeasure}</td>
                    {/*<td className="right">{numeral(item.AvgCost).format('0.000')}</td>*/}
                    <td className="right">{item.StandardUnitPrice.toFixed(3)}</td>
                    <td className="right">{numeral(oldPrice).format('0.000')}</td>
                    <td className="right">{numeral(newPrice).format('0.000')}</td>
                    {/*<td className="right">{numeral((newPrice - item.AvgCost) / newPrice).format('0.000')}</td>*/}
                </tr>
            );
        });
        return (
            <table className="table table-hover table-sm table-responsive-sm sticky">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Product Type</th>
                    <th>Std UM</th>
                    {/*<th className="right">Avg Cost</th>*/}
                    <th className="right">Std Price</th>
                    <th className="right">Current Price</th>
                    <th className="right">New Price</th>
                    {/*<th className="right">Margin</th>*/}
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }

    render() {
        const {valid, changed, item, fromPrice, newDiscountMarkup} = this.state;
        const {priceCode, priceLevel} = this.props;

        const items = this.renderItemList();
        const className = classNames({
            'has-warning': changed,
            'has-error': !valid
        });
        return (
            <div className="price-level-edit" style={{position: 'sticky', top: 0}}>
                <h3>Price Code: {priceCode.PriceCode || '___'} / Price Level: {priceLevel || '_'}</h3>
                <p>{priceCode.PriceCodeDesc || ''}</p>
                <form className="form-inline my-sm-3">
                    <div className={classNames('form-group', className)}>
                        <label className="control-label">New Disc</label>
                        <input type="text" placeholder="0.000%"
                               className="form-control form-control-sm right"
                               value={numeral(priceCode.DiscountMarkup1).format('0.000') + '%'}
                               readOnly={true} />
                        <input type="number" placeholder="0.000%"
                               className="form-control form-control-sm right"
                               value={newDiscountMarkup || ''}
                               disabled={priceLevel === ''}
                               onChange={::this.setNewDiscount} />
                    </div>
                    <div className={classNames('form-group', className)}>
                        <label className="control-label">New Price</label>
                        <input type="text" placeholder="0.000"
                               className="form-control form-control-sm right"
                               readOnly={true} value={numeral(item.StandardUnitPrice).format('0.000')} />
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="0.000"
                               className="form-control form-control-sm right"
                               value={fromPrice || ''}
                               disabled={item.ItemCode === '' || priceLevel === ''}
                               onChange={::this.setNewDiscountFromPrice}/>
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-primary btn-sm"
                                disabled={!valid || priceLevel === ''}
                                onClick={::this.saveDiscount}>Save</button>
                    </div>
                </form>
                {items}
            </div>
        );
    }
}
