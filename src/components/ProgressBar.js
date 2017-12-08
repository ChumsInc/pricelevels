/**
 * Created by steve on 8/24/2016.
 */

import React from 'react';
import classNames from 'classnames';

export default class ProgressBar extends React.Component {
    render() {
        if (this.props.visible !== undefined && this.props.visible === false) {
            return (
                <div></div>
            );
        }
        const value = this.props.value || 100,
            label = this.props.label || '',
            min = this.props.min || 0,
            max = this.props.max || 100,
            animated = this.props.animated === undefined ? true : this.props.animated;
        let cssClass = classNames(this.props.classNames || '', {
            'progress-bar': true,
            'progress-bar-striped': animated,
            active: animated
        });

        return (
            <div className="progress">
                <div className={cssClass}
                     role="progressbar"
                     aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
                     style={{width: `${value}%`}}>
                    <span>{label}</span>
                </div>
            </div>
        );
    }
}