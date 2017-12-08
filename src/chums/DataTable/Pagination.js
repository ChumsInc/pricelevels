/**
 * Created by steve on 3/29/2017.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PAGE_LABELS = {
    first: '«',
    prev: '‹',
    ellipsis: '…',
    next: '›',
    last: '»'
};

export default class Pagination extends Component {
    static propTypes = {
        first: PropTypes.bool,
        prev: PropTypes.bool,
        next: PropTypes.bool,
        last: PropTypes.bool,
        ellipsis: PropTypes.bool,
        maxButtons: PropTypes.number,
        activePage: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired,
        onSelect: PropTypes.func.isRequired,
    };

    id = 0;
    beforeRender = 0;
    afterRender = 0;

    constructor() {
        super();
        this.onSelect = ::this.onSelect;
    }

    onSelect(page) {
        if (page < 1 || page > this.props.pages) {
            return;
        }
        this.props.onSelect(page);
    }

    componentWillReceiveProps() {
        this.id = 0;
    }

    renderPageButton(page) {

    }

    renderCurrentPage(page, label = null) {
        return (
            <li key={this.id} className={classNames({active: label === null})}><span>{label || page}</span></li>
        )
    }

    renderSelectablePage(page, label) {
        return (
            <li key={this.id} onClick={this.onSelect.bind(this, page)}
                className={classNames({disabled: page < 1 || page > this.props.pages || label === PAGE_LABELS.ellipsis})}>
                <a href="#">{label || page}</a>
            </li>
        );
    }
    renderButton(page, label = null) {
        this.id += 1;

        return page === this.props.activePage
            ? this.renderCurrentPage(page, label)
            : this.renderSelectablePage(page, label);
    }

    renderFirst() {
        return this.props.first
            ? this.renderButton(1, PAGE_LABELS.first)
            : null;
    }

    renderPrev() {
        return this.props.prev
            ? this.renderButton(this.props.activePage - 1, PAGE_LABELS.prev)
            : null;
    }

    renderNext() {
        return this.props.next
            ? this.renderButton(this.props.activePage + 1, PAGE_LABELS.next)
            : null;
    }

    renderLast() {
        return this.props.last
            ? this.renderButton(this.props.pages, PAGE_LABELS.last)
            : null;
    }

    renderEllipsis(trailing = false) {
        const {maxButtons, activePage, pages, ellipsis } = this.props;
        if (!ellipsis) {
            return null;
        }
        if (!trailing && activePage <= this.minPage) {
            return null;
        } else if (trailing === true && (this.maxPage < maxButtons || activePage >= this.maxPage)) {
            return null;
        }
        return this.renderButton(0, PAGE_LABELS.ellipsis);
    }

    render() {
        const {maxButtons, activePage, pages } = this.props;
        let children = [];
        this.minPage = Math.ceil((maxButtons || 5) / 2);
        this.maxPage = pages - Math.floor((maxButtons || 5) / 2);
        const beforeRender = Math.min(activePage - this.minPage, pages - maxButtons);
        const afterRender = Math.max(activePage + this.minPage, maxButtons + 1);
        for (let i = 1; i <= pages; i += 1) {
            if (i > beforeRender && i < afterRender) {
                children.push(this.renderButton(i));
            }
        }
        // console.log('render()', children.length, beforeRender, afterRender, this.props);
        return (
            <nav aria-label="Page Navigation">
                <ul className="pagination">
                {this.renderFirst()}
                {this.renderPrev()}
                {this.renderEllipsis()}
                {children}
                {this.renderEllipsis(true)}
                {this.renderNext()}
                {this.renderLast()}
                </ul>
            </nav>
        )
    }
}