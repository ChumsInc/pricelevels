/**
 * Created by steve on 8/24/2016.
 */

import React, {Component} from 'react';
import PropTypes from 'proptypes';


export default class PriceCodeSelect extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        priceCodes: PropTypes.object.isRequired,
        priceCode: PropTypes.any
    };

    onChange(ev) {
        this.props.onChange(ev.target.value);
    }

    render() {
        const {priceCodes, priceCode} = this.props;

        let options = Object.keys(priceCodes)
            .sort()
            .filter(key => priceCodes[key].ItemsCount > 0)
            .map(key => {
                const pc = priceCodes[key];
                return (
                    <option key={pc.PriceCode} value={pc.PriceCode}>{pc.PriceCode}: {pc.PriceCodeDesc}</option>
                )
            });

        return (
            <select className="form-control form-control-sm" onChange={::this.onChange} value={priceCode.PriceCode || ''}>
                <option key="null" value="">: Select a Price Code</option>
                {options}
            </select>
        );
    }
}
