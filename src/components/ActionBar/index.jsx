// @flow

import React, { Component } from 'react'
import BN from 'bignumber.js'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Container, Button } from '@streamr/streamr-layout'

import links from '../../links'
import type { Filter, SearchFilter, CategoryFilter, SortByFilter } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'
import { isValidSearchQuery } from '../../utils/validate'

import SearchInput from './SearchInput'
import FilterSelector from './FilterSelector'
import FilterDropdownItem from './FilterDropdownItem'
import styles from './actionBar.pcss'

const sortByOptions = [{
    value: 'pricePerSecond',
    name: 'Price, low to high',
}, {
    value: 'free',
    name: 'Free products only',
}]

export type Props = {
    filter: Filter,
    categories: ?Array<Category>,
    onCategoryChange: (filter: Filter) => void,
    onSortChange: (filter: Filter) => void,
    onSearchChange: (filter: Filter) => void,
}

class ActionBar extends Component<Props> {
    onSearchChange = (search: SearchFilter) => {
        if (isValidSearchQuery(search)) {
            this.props.onSearchChange({
                ...this.props.filter,
                search,
            })
        }
    }

    onCategoryChange = (category: ?CategoryFilter) => {
        this.props.onCategoryChange({
            ...this.props.filter,
            categories: category,
        })
    }

    onSortByChange = (sortBy: ?SortByFilter) => {
        if (sortBy === 'free') {
            this.props.onSortChange({
                ...this.props.filter,
                sortBy: null,
                maxPrice: '0',
            })
        } else {
            this.props.onSortChange({
                ...this.props.filter,
                maxPrice: null,
                sortBy,
            })
        }
    }

    onSortBySelect = (sortBy: ?SortByFilter, dropdownValue: string) => (
        (sortBy === 'pricePerSecond' && dropdownValue === 'pricePerSecond') ||
        (BN(this.props.filter.maxPrice).isEqualTo('0') && dropdownValue === 'free')
    )

    currentCategoryFilter = () => {
        const { filter: { categories: category }, categories } = this.props
        const categoryFilter = categories ? categories.find((c) => c.id === category) : null
        return categoryFilter && categoryFilter.name
    }

    currentSortByFilter = () => {
        const opt = BN(this.props.filter.maxPrice).isEqualTo('0') ?
            sortByOptions.find((o) => o.value === 'free') :
            sortByOptions.find((o) => o.value === this.props.filter.sortBy)

        return opt ? opt.name : null
    }

    render() {
        const { filter: { search, categories: category, sortBy, maxPrice }, categories } = this.props
        return (
            <div className={styles.actionBar}>
                <SearchInput value={search} onChange={this.onSearchChange} />
                <div className={styles.searchFilter}>
                    <Container>
                        <ul>
                            <li>
                                <FilterSelector
                                    title="Category"
                                    selected={this.currentCategoryFilter()}
                                    onClear={() => this.onCategoryChange(null)}
                                    className={(category === null) ? '' : styles.activeFilter}
                                >
                                    {!!categories && categories.map((c) => (
                                        <FilterDropdownItem
                                            key={c.id}
                                            value={c.id}
                                            selected={c.id === category}
                                            onSelect={this.onCategoryChange}
                                        >
                                            {c.name}
                                        </FilterDropdownItem>
                                    ))}
                                </FilterSelector>
                            </li>
                            <li>
                                <FilterSelector
                                    title="Sort by"
                                    selected={this.currentSortByFilter()}
                                    onClear={() => this.onSortByChange(null)}
                                    className={(sortBy === null && maxPrice === null) ? '' : styles.activeFilter}
                                >
                                    {sortByOptions.map((option) => (
                                        <FilterDropdownItem
                                            key={option.value}
                                            value={option.value}
                                            selected={this.onSortBySelect(sortBy, option.value)}
                                            onSelect={this.onSortByChange}
                                        >
                                            {option.name}
                                        </FilterDropdownItem>
                                    ))}
                                </FilterSelector>
                            </li>
                            <li className={classNames('hidden-sm-down', styles.createProduct)}>
                                <Link to={links.createProduct}>
                                    <Button className={styles.createProductButton} color="secondary" outline>Create a Product</Button>
                                </Link>
                            </li>
                        </ul>
                    </Container>
                </div>
            </div>
        )
    }
}

export default ActionBar
