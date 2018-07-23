import React, {Component} from 'react';
import CompanySelect from './CompanySelect';
import {connect} from 'react-redux';
import PropTypes from 'proptypes';
import {fetchChanges, fetchUserList, setCompany, setUser} from "../actions/AppActions";

class PriceCodeChanges extends Component {
    static propTypes = {
        company: PropTypes.string.isRequired,
    };

    onChangeCompany(val) {
        this.props.dispatch(setCompany(val))
    }

    onChangeEmployee(ev) {
        console.log(ev.target.value);
        this.props.dispatch(setUser(ev.target.value));
        this.props.dispatch(fetchChanges());
    }

    handleSubmit(ev) {
        ev.preventDefault();
        if (this.props.user === '') {
            this.props.dispatch(fetchUserList())
        } else {
            this.props.dispatch(fetchChanges());
        }
    }

    renderChanges() {
        const {changes = []} = this.props;
        return changes
            .map(row => {
                return (
                    <tr>
                        <td>{row.PriceCode}</td>
                        <td>{row.PriceCodeDesc}</td>
                        <td>{row.CustomerPriceLevel}</td>
                        <td>{row.oldDiscountMarkup1 ? Number(row.oldDiscountMarkup1).toFixed(3) : ''}</td>
                        <td>{row.DiscountMarkup1}</td>
                    </tr>
                )
            })
    }

    render() {
        const {company, users, user} = this.props;
        const url = '/node-dev/sales/pricing/:Company/changes/:UserName/VI'
            .replace(':Company', company)
            .replace(':UserName', user);
        return (
            <div>
                <form className="form-inline mb-3" onSubmit={::this.handleSubmit}>
                    <div className="form-group mx-1">
                        <CompanySelect value={company} onChange={::this.onChangeCompany} />
                    </div>
                    <div className="form-group mx-1">
                        <select className="form-control form-control-sm" value={user} onChange={::this.onChangeEmployee}>
                            <option value="">Select One</option>
                            {users.map((u, index) => <option value={u} key={index}>{u}</option> )}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-sm btn-primary mx-1">Load</button>
                    <a href={url} className="btn btn-sm btn-outline-secondary mx-1">Download VI file</a>
                </form>
                <table className="table table-hover table-sm">
                    <thead>
                    <tr>
                        <th>Price Code</th>
                        <th>Description</th>
                        <th>Customer Price Level</th>
                        <th>Old Discount</th>
                        <th>New Discount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderChanges()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { company, changes, users, user } = state;
    return { company, changes, users, user };
};

export default connect(mapStateToProps)(PriceCodeChanges);
