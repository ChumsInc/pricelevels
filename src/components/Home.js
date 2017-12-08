/**
 * Created by steve on 8/24/2016.
 */

import React, { Component } from 'react';
import PriceCodes from './PriceCodes';
import ItemPricing from './ItemPricing';

export default class Home extends Component {
    constructor () {
        super();

        this.state = {
            tabs: [
                {key: 'price-codes', title: 'Price Codes'},
                {key: 'price-list', title: 'Item Pricing List'}
            ],
            currentTab: 'price-list'
        };
    }

    setTab(which) {
        this.setState({currentTab: which});
    }

    render() {
        let tabs = this.state.tabs.map(tab => {
            return (
                <li key={tab.key} role="presentation"
                    className={tab.key === this.state.currentTab ? 'active' : ''}
                    onClick={this.setTab.bind(this, tab.key)}>
                    <a>{tab.title}</a>
                </li>
            );
        });
        let content;
        switch(this.state.currentTab) {
        case 'price-codes':
            content = <PriceCodes/>;
            break;
        case 'price-list':
            content = <ItemPricing/>;
            break;
        default:
            content = (
                <div className="panel panel-warning">
                    <div className="panel-heading">
                        <h3 className="panel-title">Navigation error</h3>
                    </div>
                    <div className="panel-body">
                        The content you requested was not found!
                    </div>
                </div>
            );
        }
        return (
            <div>
                <ul className="nav nav-tabs">
                    {tabs}
                </ul>
                <div>
                    {content}
                </div>
            </div>
        );
    }
}