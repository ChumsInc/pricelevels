/**
 * Created by steve on 8/24/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import numeral from 'numeral';

export default class PriceCodesTable extends React.Component {
    static propTypes = {
        filter: PropTypes.string.isRequired,
        priceCodes: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        selected: PropTypes.object,
        filterChanged: PropTypes.bool,
    };


    onClick(code) {
        this.props.onClick(code);
    }

    render() {
        const {filter, selected, priceCodes, filterChanged} = this.props;
        const re = filter.trim() === ''
            ? true
            : new RegExp(filter.trim(), 'i');

        let rows = Object.keys(priceCodes)
            .sort()
            .map(key => priceCodes[key])
            .filter(row => row.ItemsCount !== 0)
            .filter(row => filterChanged === false || row.newDiscountMarkup !== null)
            .filter(row => {
                return re === true
                    || re.test(row.PriceCode)
                    || re.test(row.PriceCodeDesc);
            })
            .map(pc => {
                const cssClass = classNames({
                    'table-secondary': pc.ItemsCount === 0,
                    'table-info': selected && pc.PriceCode === selected.PriceCode,
                    'table-warning': (pc.newDiscountMarkup !== null) && pc.DiscountMarkup1 !== pc.newDiscountMarkup,
                    'table-danger': pc.PricingMethod === undefined
                });
                return (
                    <tr key={pc.PriceCode} className={cssClass} onClick={this.onClick.bind(this, pc)}>
                        <td>{pc.PriceCode}</td>
                        <td>{pc.PriceCodeDesc || ''}</td>
                        <td className="center">{pc.PricingMethod || ''}</td>
                        <td className="right">{pc.BreakQuantity1 || ''}</td>
                        <td className="right">{pc.DiscountMarkup1 ? pc.DiscountMarkup1.toFixed(3) : ''}</td>
                        <td className="right">{pc.newDiscountMarkup !== null ? numeral(pc.newDiscountMarkup).format('0.000') : ''}</td>
                        <td className="center">{pc.UserName || ''}</td>
                    </tr>
                );
            });
        return (
            <table className="table table-hover table-sm table-responsive-sm sticky">
                <thead>
                <tr>
                    <th>Price Code</th>
                    <th>Description</th>
                    <th>Pricing Method</th>
                    <th>Break Quantity</th>
                    <th>Discount Markup</th>
                    <th>New Discount</th>
                    <th>User</th>
                </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}
