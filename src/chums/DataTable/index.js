/**
 * Created by steve on 3/22/2017.
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThSortable from './ThSortable';
import ProgressBar from '../ProgressBar';
import classNames from 'classnames';
import Pagination from './Pagination';

export {ThSortable, ProgressBar, Pagination};
export DataTableFilter from './DataTableFilter';

export default class DataTable extends Component {
    static propTypes = {
        fields: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        selected: PropTypes.object,
        defaultSort: PropTypes.string,
        loading: PropTypes.bool,
        rowsPerPage: PropTypes.number,
        maxHeight: PropTypes.number,
        hasTotal: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            field: '',
            asc: true,
            page: 1,
        };
        this.onSetPage = ::this.onSetPage;
    }

    componentWillMount() {
        if (this.state.field === '') {
            if (this.props.defaultSort) {
                this.state.field = this.props.defaultSort;
            } else {
                let keys = Object.keys(this.props.fields);
                if (keys.length) {
                    this.state.field = keys[0];
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.rowsPerPage && this.state.page * nextProps.rowsPerPage > nextProps.data.length) {
            this.setState({
                page: 1
            });
        }
    }

    onSetPage(page) {
        this.setState({
            page: page
        });
    }

    onSelect(obj) {
        if (this.props.onSelect) {
            this.props.onSelect(obj);
        }
    }

    onClickSort(field) {
        if (this.props.fields[field].sortable === false) {
            return;
        }
        if (this.state.field === field) {
            this.setState({asc: !this.state.asc, page: 1});
        } else {
            this.setState({field, asc: true, page: 1});
        }
    }

    renderTh() {
        return Object.keys(this.props.fields)
            .map(key => {
                let className = this.props.fields[key].className || '';
                return (
                    <ThSortable key={key} sorted={this.state.field === key} asc={this.state.asc}
                                onClick={this.onClickSort.bind(this, key)} className={className}>
                        {this.props.fields[key].title || this.props.fields[key]}
                    </ThSortable>
                )
            });
    }

    renderRow(row) {
        const { fields, selected } = this.props;
        const tdList = Object.keys(fields)
            .map(key => {
                let text = row[key];
                let className = fields[key].className || '';
                if (fields[key].render) {
                    text = fields[key].render(text, row);
                }
                return (
                    <td key={key} className={className}>{text}</td>
                )
            });
        const className = classNames({
            'table-info': selected !== undefined && selected.key === row.key,
            'table-danger': row.active !== undefined && !row.active
        }, row.classNames || {});
        return (
            <tr key={row.key} onClick={this.onSelect.bind(this, row)} className={className}>{tdList}</tr>
        )
    }

    renderFooter(totals) {
        const { fields } = this.props;
        let td = Object.keys(fields)
            .map(key => {
                let totalField = fields[key].total;
                if (totalField === undefined) {
                    return (<td key={key} >&nbsp;</td>);
                }
                if (typeof totalField !== 'string' && totals[key]) {
                    totalField = totals[key].sum;
                }
                let className = fields[key].className || '';
                if (fields[key].render) {
                    totalField = fields[key].render(totalField);
                }
                return (
                    <td key={key} className={className}>{totalField}</td>
                )
            });
        return (
            <tfoot>
                <tr>
                    {td}
                </tr>
            </tfoot>
        );
    }

    sortRows(a, b) {
        let aVal = a[this.state.field],
            bVal = b[this.state.field];
        if (this.props.fields[this.state.field] && this.props.fields[this.state.field].sortMod) {
            aVal = this.props.fields[this.state.field].sortMod(aVal);
            bVal = this.props.fields[this.state.field].sortMod(bVal);
        }
        return aVal === bVal ? 0 : ((aVal > bVal ? 1 : -1) * (this.state.asc ? 1 : -1));
    }


    render() {
        const { fields, data, rowsPerPage, hasTotal, loading } = this.props;
        const thList = this.renderTh();
        let totals = {};
        Object.keys(fields)
            .filter(key => {
                return fields[key].total === true;
            })
            .forEach(key => {
                totals[key] = {sum: 0, ct: 0};
            });
        const rows = data
            .sort(::this.sortRows)
            .map(row => {
                Object.keys(totals)
                    .forEach(key => {
                        if (totals[key] !== null && row[key] !== undefined) {
                            totals[key].sum += row[key];
                            totals[key].ct += 1;
                        }
                    });
                return row;
            })
            .filter((row, index) => {
                return rowsPerPage === undefined || Math.ceil((index + 1) / rowsPerPage) === this.state.page;
            })
            .map(row => this.renderRow(row));
        const pager = rowsPerPage
            ? <Pagination activePage={this.state.page} pages={Math.ceil(data.length / rowsPerPage)}
                          onSelect={this.onSetPage}
                          first last ellipsis next prev maxButtons={9}/>
            : null;

        const footer = hasTotal ? this.renderFooter(totals) : null;

        const maxHeight = rowsPerPage ? {} : {maxHeight: (this.props.maxHeight || 500)};
        return (
            <div>
                <div className="" style={maxHeight}>
                    <ProgressBar active={true} striped={true} visible={loading === true} />
                    <table className="table table-responsive-sm table-hover table-sm">
                        <thead className="sticky">
                        <tr>
                            {thList}
                        </tr>
                        </thead>
                        {footer}
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                </div>
                {pager}
            </div>
        )
    }
}
