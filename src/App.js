import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import {clearError, setCompany, setTab} from "./actions/AppActions";
import {TABS} from "./constants/App";
import PriceCodes from './components/PriceCodes';
import ItemPricing from './components/ItemPricing';
import {fetchPriceCodes} from "./actions/priceCodes";
import PriceCodeChanges from "./components/PriceCodeChanges";
import DismissableAlert from "./components/DismissableAlert";

class App extends Component {
    static propTypes = {
        tab: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.dispatch(setCompany())
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(setTab());
        // dispatch(fetchEmployeesIfNeeded());
    }

    onSelectTab(which) {
        const {key} = TABS[which];
        if (key === undefined) {
            return;
        }
        this.props.dispatch(setTab(key));
    }

    onDismissError(index) {
        this.props.dispatch(clearError(index));
    }

    renderTabs() {
        const {tab} = this.props;
        return Object.keys(TABS).map(key => {
            return (
                <li className="nav-item" key={key}>
                    <a className={classNames('nav-link', {active: tab === TABS[key].key})}
                       onClick={this.onSelectTab.bind(this, TABS[key].key)}>
                        {TABS[key].title}
                    </a>
                </li>
            )
        });
    }

    render() {
        const {tab, errors} = this.props;
        const alerts = errors.map((error, index) => {
            return (
                <DismissableAlert key={index} message={error} onDismiss={this.onDismissError.bind(this, index)}/>
            )
        });



        let content = (
            <div>{tab}</div>
        );
        switch (tab) {
        case TABS.PRICE_CODES.key:
            content = (<PriceCodes />);
            break;
        case TABS.PRICE_LIST.key:
            content = (<ItemPricing />);
            break;
        case TABS.CHANGE_LIST.key:
            content = (<PriceCodeChanges />);
        }

        return (
            <div>
                <ul className="nav nav-tabs" role="tablist" id="dl-entry-tabs">
                    {this.renderTabs()}
                </ul>
                {alerts}
                {content}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {tab, priceCodes, errors} = state;
    return {tab, priceCodes, errors};
};

export default connect(mapStateToProps)(App);
