import React from 'react';
import classNames from 'classnames';
import PropTypes from 'proptypes';

export default class DismissableAlert extends React.Component {
    static propTypes = {
        message: PropTypes.string.isRequired,
        title: PropTypes.string,
        onDismiss: PropTypes.func,
        state: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'])
    };

    onDismiss() {
        this.props.onDismiss();
    }

    render() {
        const {message, title, state, onDismiss} = this.props;

        const classnames = {
            alert: true,
            'alert-primary': state === 'primary',
            'alert-secondary': state === 'secondary',
            'alert-success': state === 'success',
            'alert-danger': state === 'danger',
            'alert-warning': state === 'warning' || state === undefined,
            'alert-info': state === 'info',
            'alert-dark': state === 'dark',
        };

        const dismisser = onDismiss === undefined
            ? ''
            : (
                <button type="button" className="close" onClick={::this.onDismiss}>
                    <span aria-hidden="true">&times;</span>
                </button>
            );
        return (
            <div className={classNames(classnames)}>
                <strong>{title || 'Hey!'}</strong> {message}
                {dismisser}
            </div>
        )
    }
}
