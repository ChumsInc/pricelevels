/**
 * Created by steve on 9/8/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ProgressBar extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        striped: PropTypes.bool,
        active: PropTypes.bool,
        label: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number
    };

    render() {
        const progressClass = classNames('progress-bar', {
            'progress-bar-striped': this.props.striped,
            'active': this.props.active
        });

        const labelClass = classNames({
            'sr-only': this.props.label === undefined
        });

        const styles = {
            display: (this.props.visible || this.props.visible === undefined ? 'block' : 'none'),
            ...this.props.style
        };

        const value = this.props.value === undefined ? 100 : this.props.value;
        return (
            <div className="progress" style={styles}>
                <div className={progressClass} role="progressbar"
                     aria-valuenow={this.props.value} aria-valuemin={this.props.min || 0} aria-valuemax={this.props.max || 100}
                     style={{width: `${value}%`}}>
                    <span className={labelClass}>{this.props.label || ''}</span>
                </div>
            </div>
        );
    }
}
