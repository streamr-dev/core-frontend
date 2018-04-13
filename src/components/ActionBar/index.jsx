// @flow

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Container, Button } from '@streamr/streamr-layout'

import links from '../../links'
import type { Filter, SearchFilter, CategoryFilter, SortByFilter } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'

import SearchInput from './SearchInput'
import FilterDropdown from './FilterDropdown'
import FilterDropdownItem from './FilterDropdownItem'
import styles from './search.pcss'

const sortByOptions = [
    {
        value: 'price',
        name: 'Price, low to high',
    },
    {
        value: 'free',
        name: 'Free products only',
    },
]

export type Props = {
    filter: Filter,
    categories: ?Array<Category>,
    onChange: (filter: Filter) => void,
}

class ActionBar extends Component<Props> {
    onSearchChange = (search: SearchFilter) => {
        this.props.onChange({
            ...this.props.filter,
            search,
        })
    }

    onCategoryChange = (category: ?CategoryFilter) => {
        this.props.onChange({
            ...this.props.filter,
            category,
        })
    }

    onSortByChange = (sortBy: ?SortByFilter) => {
        if (sortBy === 'free') {
            this.props.onChange({
                ...this.props.filter,
                sortBy: null,
                maxPrice: 0,
            })
        } else {
            this.props.onChange({
                ...this.props.filter,
                maxPrice: null,
                sortBy,
            })
        }
    }

    currentCategory = () => {
        const { filter: { category }, categories } = this.props
        return categories ? categories.find((c) => c.id === category) : null
    }

    currentCategoryFilter = () => (
        (this.currentCategory() || {
            name: 'any',
        }).name
    )

    currentSortByFilter = () => {
        if (this.props.filter.maxPrice === 0) {
            return (sortByOptions.find((o) => o.value === 'free') || {
                name: 'default',
            }).name
        }

        return (sortByOptions.find((o) => o.value === this.props.filter.sortBy) || {
            name: 'default',
        }).name
    }

    render() {
        const { filter: { search, category, sortBy, maxPrice }, categories } = this.props

        return (
            <div className={styles.actionBar}>
                <SearchInput value={search} onChange={this.onSearchChange} />
                <div className={styles.searchFilter}>
                    <Container>
                        <ul>
                            <li>
                                <FilterDropdown
                                    title={(category === null) ? 'Category' : this.currentCategoryFilter()}
                                    onClear={this.onCategoryChange}
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
                                </FilterDropdown>
                            </li>
                            <li>
                                <FilterDropdown
                                    title={(sortBy === null && maxPrice === null) ? 'Sort by' : this.currentSortByFilter()}
                                    onClear={this.onSortByChange}
                                >
                                    {sortByOptions.map((option) => (
                                        <FilterDropdownItem
                                            key={option.value}
                                            value={option.value}
                                            selected={sortBy === option.value}
                                            onSelect={this.onSortByChange}
                                        >
                                            {option.name}
                                        </FilterDropdownItem>
                                    ))}
                                </FilterDropdown>
                            </li>
                            <li className={classNames(styles.createProduct)}>
                                <Link to={links.createProduct}>
                                    <Button color="secondary">Create Product</Button>
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
