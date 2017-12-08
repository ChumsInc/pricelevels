/**
 * Created by steve on 9/15/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ThSortable extends Component {
    static propTypes = {
        asc: PropTypes.bool.isRequired,
        sorted: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.any,
    };

    onClick() {
        this.props.onClick();
    }

    render() {
        let sortClass = this.props.asc
                ? 'glyphicon glyphicon-sort-by-attributes'
                : 'glyphicon glyphicon-sort-by-attributes-alt',
            sortIcon = this.props.sorted
                ? (<span className={sortClass} />)
                : '';
        return (
            <th className={classNames(this.props.className || '', "sortable")} onClick={this.onClick.bind(this)}>{this.props.children}{sortIcon}</th>
        );
    }
}