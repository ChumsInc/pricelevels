/**
 * Created by steve on 3/22/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DataTableFilter extends Component {
    static propTypes = {
        filter: PropTypes.string.isRequired,
        onChangeFilter: PropTypes.func.isRequired,
        onReload: PropTypes.func,
        showInactive: PropTypes.bool,
        onToggleInactive: PropTypes.func
    };

    onChangeFilter(ev) {
        this.props.onChangeFilter(ev.target.value);
    }

    onClickReload() {
        this.props.onReload();
    }

    onToggleInactive(ev) {
        this.props.onToggleInactive();
    }

    renderInactive() {
        if (this.props.onToggleInactive !== undefined) {
            return (
                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={this.props.showInactive} onChange={::this.onToggleInactive}/>
                        Show Inactive
                    </label>
                </div>
            )
        }
        return null;
    }

    renderReload() {
        if (this.props.onReload !== undefined) {
            return (
                <button type="btn" className="btn btn-primary" onClick={::this.onClickReload}>Reload</button>
            )
        }
        return null;
    }

    render() {
        return (
            <div className="form-inline">
                <div className="form-group">
                    <label>Filter</label>
                    <input type="text" className="form-control" value={this.props.filter}
                           placeholder="Filter this list"
                           onChange={::this.onChangeFilter} />
                </div>
                {this.renderInactive()}
                {this.props.children || []}
                {this.renderReload()}
            </div>
        )
    }
}