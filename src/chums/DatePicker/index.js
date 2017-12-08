/**
 * Created by steve on 1/31/2017.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import moment from 'moment';
import styles from './datepicker.css';


class DatePickerComponent extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date), PropTypes.instanceOf(moment)]),
        allowWeekends: PropTypes.bool,
        readOnly: PropTypes.bool,
        minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        small: PropTypes.bool,
        large: PropTypes.bool,
        allowFuture: PropTypes.bool,
    };
    constructor() {
        super();
        this.state = {
            selected: moment(),
            display: moment(),
            visible: false,
        }
    }

    componentWillMount() {
        // console.log('componentWillMount()', this.props);
        this.setState({
            selected: moment(this.props.value || moment()),
            display: moment(this.props.value || moment()),
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: moment(nextProps.value || moment()),
            display: moment(nextProps.value || moment()),
        });
    }


    onClickInput() {
        this.setState({
            visible: !this.state.visible
        });
    }

    onBlur(ev) {
        // console.log(ev);
        // if (this.state.visible) {
        //     setTimeout(() => {
        //         this.setState({
        //             visible: false
        //         });
        //     }, 50);
        // }
    }

    handleClickOutside = evt => {
        this.setState({visible: false});
    };

    onClickPrevMonth() {
        this.setState({
            display: this.state.display.subtract({month: 1})
        });
    }

    onClickNextMonth() {
        this.setState({
            display: this.state.display.add({month: 1})
        });
    }

    onClickToday() {
        this.setState({display: moment()});
    }

    onSelectDay(day) {
        if (this.props.readOnly) {
            day = this.state.selected;
        } else if (this.props.minDate && moment(this.props.minDate) > day) {
            return;
        } else if (!this.props.allowWeekends) {
            if (day.day() === 0 || day.day() === 6) {
                return;
            }
        }
        this.setState({
            selected: day,
            visible: false
        });
        if (!this.props.readOnly) {
            this.props.onChange(day.toISOString());
        }

    }

    calcWeeks() {
        let day = this.state.display;
        let startWeek = day.clone().date(1).day(-7).week();
        let endWeek = day.clone().date(1).add({months: 1}).subtract({days: 1}).week();
        if (endWeek < startWeek) {
            endWeek += day.clone().date(1).day(-7).weeksInYear()
        }
        return endWeek - startWeek;
    }

    renderDayNames() {
        let day = this.state.display.clone();
        day.date(1).day(0);
        let dayNames = [];
        for (let d = 0; d < 7; d += 1) {
            let rendered = (
                <div className={classNames(styles.dayName, 'col px-1')} key={`${d}`}>
                    {day.format('dd')}
                </div>
            );
            dayNames.push(rendered);
            day.add(1, 'd');
        }
        return dayNames;
    }

    renderDayNumbers(startDay) {
        const today = moment();
        let day = startDay.clone();
        let minDate = moment(this.props.minDate || moment());

        let days = [];
        for (let d = 0; d < 7; d += 1) {
            let className = {
                [styles.day]: true,
                [styles.inMonth]: day.year() === this.state.display.year() && day.month() === this.state.display.month(),
                [styles.today]: day.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
                    && day.format('YYYY-MM-DD') !== this.state.selected.format('YYYY-MM-DD'),
                [styles.selected]: day.format('YYYY-MM-DD') === this.state.selected.format('YYYY-MM-DD'),
                [styles.disabled]: (this.props.readOnly
                    || (!this.props.allowWeekends && (day.day() === 0 || day.day() === 6))
                    || (this.props.minDate && day < minDate)
                    || (this.props.allowFuture !== true && day > today)
                )
            };
            className[day.format('[day]-d')] = true;
            let rendered = (
                <div className={classNames(styles.dayContainer, 'col px-1')} key={d} onClick={this.onSelectDay.bind(this, day.clone())}>
                    <div className={classNames(className)}>{day.date()}</div>
                </div>
            );
            days.push(rendered);
            day.add(1, 'd');
        }
        return days;
    }

    renderWeeks() {
        let day = this.state.display.clone();
        let weeks = this.calcWeeks();

        day.date(1).day(0);
        const rows = [];
        for (let w = 0; w < weeks; w += 1) {
            const days = this.renderDayNumbers(day);
            const row = (
                <div className="row px-1" key={w}>
                    {days}
                </div>
            );
            rows.push(row);
            day.add(7, 'd');
        }
        return rows;
    }

    renderDatePicker() {
        const {display, visible} = this.state;
        const {title} = this.props;

        const popoverClassName = classNames({
            popover: true,
            fade: true,
            'bs-popover-bottom': true,
            show: visible
        }, styles.popover);
        const popoverStyle = {
            display: title === '' ? 'none' : 'block',
            width: '100%'
        };

        let dayNames = this.renderDayNames();
        let days = this.renderWeeks();
        return (
            <div className={popoverClassName} style={popoverStyle}>
                <div className="arrow" style={{left: '50%'}} />
                <h3 className="popover-header" style={popoverStyle}>
                    {title ? <div>{title}</div> : ''}
                    <div className="row px-1">
                        <div className={classNames(styles.monthSelector, 'col')} onClick={::this.onClickPrevMonth}>&laquo;</div>
                        <div className={classNames(styles.monthName, 'col')} onClick={::this.onClickToday} title="Go to today">
                            {display.format('MMM YYYY')}
                        </div>
                        <div className={classNames(styles.monthSelector, 'col')} onClick={::this.onClickNextMonth}>&raquo;</div>
                    </div>
                    <div className="row px-1">
                        {dayNames}
                    </div>
                </h3>
                <div className="popover-body">
                    <div className="">
                        {days}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let datePicker = this.state.visible ? this.renderDatePicker() : null;
        const {
            className,
            onChange, value, format, title, allowWeekends, minDate, //discarded props
            eventTypes, outsideClickIgnoreClass, preventDefault, stopPropagation, disableOnClickOutside, enableOnClickOutside, // discarded for react-onclickoutside
            large, small,
            ...props} = this.props;
        const classnames = classNames("form-control", className, {'form-control-lg': large, 'form-control-sm': small});
        return (
            <div className={styles.datePicker}>
                <input type="text"
                       className={classnames}
                       value={this.state.selected.format('DD MMM YYYY')}
                       {...props}
                       onChange={() => {}}
                       onClick={::this.onClickInput} />
                <div style={{position: 'relative'}}>
                {datePicker}
                </div>
            </div>
        )
    }
}

export default onClickOutside(DatePickerComponent);
// export default DatePickerComponent;
