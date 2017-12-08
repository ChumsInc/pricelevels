import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import {setTab} from "./actions/AppActions";
import {TABS} from "./constants/App";
import PriceCodes from './components/PriceCodes';
import ItemPricing from './components/ItemPricing';
import {fetchPriceCodes} from "./actions/priceCodes";


class App extends Component {
    static propTypes = {
        tab: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.dispatch(fetchPriceCodes())
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
        const {tab} = this.props;

        let content = (
            <div>{tab}</div>
        );
        switch (tab) {
        case TABS.PRICE_CODES.key:
            content = (<PriceCodes />);
            break;
        case TABS.PRICE_LIST.key:
            content = <ItemPricing />
            break;
        }

        return (
            <div>
                <ul className="nav nav-tabs" role="tablist" id="dl-entry-tabs">
                    {this.renderTabs()}
                </ul>
                {content}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {tab, priceCodes} = state;
    return {tab, priceCodes};
};

export default connect(mapStateToProps)(App);
