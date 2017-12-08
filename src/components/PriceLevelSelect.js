/**
 * Created by steve on 8/24/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { COMPANIES, PRICE_LEVELS } from '../constants';


export default class PriceLevelSelect extends React.Component {
    static propTypes = {
        company: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        values: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    onChange(ev) {
        this.props.onChange(ev.target.value);
    }

    render() {
        const {company, value, values} = this.props;
        let options = Object.keys(values)
            .map(key => values[key])
            .sort((a, b) => {
                return (a.SortOrder - b.SortOrder);
            })
            .map(level => {
                const key = level.PriceLevel;
                return (
                    <option key={key} value={key}>{key}: {level.PriceLevelDescription}</option>
                )
            });

        return (
            <select className="form-control form-control-sm" onChange={::this.onChange} value={value}>
                <option key="null" value="null">: No Discount</option>
                {options}
            </select>
        );
    }
}
