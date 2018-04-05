// @flow

import React, { Component } from 'react'
import classNames from 'classnames'

import { Container } from '@streamr/streamr-layout'
import SearchInput from './SearchInput'
import FilterDropdown from './FilterDropdown'
import FilterDropdownItem from './FilterDropdownItem'
import styles from './search.pcss'

import type { Filter, SearchFilter, CategoryFilter, SortByFilter } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'

const sortByOptions = [
    {
        value: 'name',
        name: 'Name',
    },
    {
        value: 'price',
        name: 'Price',
    },
    {
        value: 'dateCreated',
        name: 'Creation date',
    },
]

export type Props = {
    filter: Filter,
    categories: ?Array<Category>,
    onChange: (filter: Filter) => void,
    onClearFilters: () => void,
}

class Search extends Component<Props> {
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
        this.props.onChange({
            ...this.props.filter,
            sortBy,
        })
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

    currentSortByFilter = () => (
        (sortByOptions.find((o) => o.value === this.props.filter.sortBy) || {
            name: 'default',
        }).name
    )

    render() {
        const { filter: { search, category, sortBy }, onClearFilters, categories } = this.props
        const currentCategory = this.currentCategory()
        const clearFiltersDisabled = !(search || currentCategory || sortBy)

        return (
            <div className={styles.search}>
                <SearchInput value={search} onChange={this.onSearchChange} />
                <div className={styles.searchFilter}>
                    <Container>
                        <ul>
                            <li>
                                <FilterDropdown title={`Category: ${this.currentCategoryFilter()}`} onClear={this.onCategoryChange}>
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
                                <FilterDropdown title={`Sort by: ${this.currentSortByFilter()}`} onClear={this.onSortByChange}>
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
                            <li className={classNames(styles.clearFilters, clearFiltersDisabled && styles.clearFiltersDisabled)}>
                                <a
                                    href="#"
                                    onClick={(e: SyntheticInputEvent<EventTarget>) => {
                                        e.preventDefault()
                                        if (!clearFiltersDisabled) {
                                            onClearFilters()
                                        }
                                    }}
                                >
                                    Clear all filters
                                </a>
                            </li>
                        </ul>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Search
