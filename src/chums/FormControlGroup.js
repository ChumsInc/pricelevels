/**
 * Created by steve on 9/14/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import DatePicker from './DatePicker/index';

export {DatePicker};

export default class FormControlGroup extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        value: PropTypes.any,
        label: PropTypes.string,
        name: PropTypes.string,
        colWidth: PropTypes.number,
        hidden: PropTypes.bool,
        small: PropTypes.bool,
        large: PropTypes.bool,
        address: PropTypes.object,
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        hideLabel: PropTypes.bool,
        onChange: PropTypes.func,
        feedback: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.element)
    };

    defaultColWidth = 8;
    onChange(ev) {
        this.props.onChange(ev.target.value);
    }

    onChangeValue(val) {
        this.props.onChange(val);
    }

    render() {
        let {className, type, onChange, style, colWidth, value, small, large, feedback, options, ...props} = this.props;
        let formControl;
        const defaultClassNames = {
            'form-control': true,
            'form-control-sm': small,
            'form-control-lg': large
        };

        switch (type) {
        case 'span':
            formControl = <span className="form-control-plaintext">{value}</span>;
            break;

        case 'date':
            let date = moment(value);
            formControl = (
                <input type="date" value={date.format('Y-MM-DD')} {...props}
                   className={classNames(className, defaultClassNames)}
                   onChange={::this.onChange}
                />
            );
            break;

        case 'datepicker':
            formControl = (
                <DatePicker value={value} onChange={::this.onChangeValue} small={small} large={large}
                            className={className} {...props} />
            );
            break;

        case 'textarea':
            formControl = (
                <textarea className={classNames(defaultClassNames, className)} onChange={::this.onChange} value={value} />
            );
            break;

        case 'select':
            formControl = (
                <select className={classNames(defaultClassNames, className)} value={value}
                        onChange={::this.onChange} {...props}>
                    {options || []}
                </select>
            );
            break;

        // case 'address':
        //     const address = value || new Address();
        //     formControl = (
        //         <address className={classNames("form-control", className)}>
        //             <div>{address.Name || ''}</div>
        //             <div>{address.AddressLine1 || ''}</div>
        //             <div>{address.AddressLine2 || ''}</div>
        //             <div>{address.AddressLine3 || ''}</div>
        //             <div>{address.City || ''},{' '}{address.State || ''}{' '}{address.ZipCode || ''}</div>
        //         </address>
        //     );
        //     break;

        default:
            if (this.props.children) {
                formControl = this.props.children;
            } else {
                const classnames = {
                    'form-control-sm': small,
                    'form-control-lg': large
                };
                formControl = (
                    <input type={type} value={value} {...props}
                           className={classNames("form-control", classnames, className)}
                           onChange={::this.onChange}
                    />
                );
            }
            break;
        }

        let colLeft = colWidth ? `col-sm-${12 - (colWidth || this.defaultColWidth)}` : '',
            colRight = colWidth ? `col-sm-${(colWidth || this.defaultColWidth)}` : '';

        const labelClasses = {
            'col-form-label': true,
            'sr-only': this.props.hideLabel,
            'col-form-label-sm': small,
            'col-form-label-lg': large,
        };

        let divClasses = {
            'hidden': this.props.hidden,
            'form-group': true,
            'row': colLeft !== '' && colRight !== '',
            'has-feedback': feedback !== '',
            'has-success': feedback === 'success',
            'has-warning': feedback === 'warning',
            'has-error': feedback === 'error',
        };
        let iconClasses = {
            glyphicon: true,
            'form-control-feedback': true,
            'glyphicon-ok ': feedback === 'success',
            'glyphicon-warning-sign': feedback === 'warning',
            'glyphicon-remove': feedback === 'error',
        };

        let feedbackComponent = feedback !== ''
            ? <span>
                <span className={classNames(iconClasses)} aria-hidden="true" />
                <span id="inputWarning2Status" className="sr-only">(warning)</span>
            </span>
            : null;

        return (
            <div className={classNames(divClasses)} style={style}>
                <label className={classNames(labelClasses, colLeft)}>{this.props.label}</label>
                <div className={classNames(colRight)}>
                    {formControl}
                    {feedbackComponent}
                </div>
            </div>
        )
    }
}
