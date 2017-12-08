/**
 * Created by steve on 8/24/2016.
 */
import React, {Component} from 'react';
import PropTypes from 'proptypes';
import { COMPANIES } from '../constants';

export default class CompanySelect extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
    };

    selectCompany(ev) {
        this.props.onChange(ev.target.value);

    }

    render() {
        let companies = COMPANIES.map(co => {
            return (
                <option key={co.code} value={co.code}>{co.name}</option>
            );
        });

        return (
            <select className="form-control form-control-sm" onChange={::this.selectCompany} value={this.props.value}>
                {companies}
            </select>
        );
    }
}
