// @flow

import React, { Component } from 'react'
import classNames from 'classnames'

import { Container } from '@streamr/streamr-layout'
import SearchInput from './SearchInput'
import FilterDropdown from './FilterDropdown'
import FilterDropdownItem from './FilterDropdownItem'
import styles from './search.pcss'

import type { Filter, SearchFilter, CategoryFilter } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'

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

    onCategoryChange = (category: CategoryFilter) => {
        this.props.onChange({
            ...this.props.filter,
            category,
        })
    }

    render() {
        const { filter: { search, category }, onClearFilters, categories } = this.props
        const clearFiltersDisabled = !(search || category !== null)

        return (
            <div className={styles.search}>
                <SearchInput value={search} onChange={this.onSearchChange} />
                <div className={styles.searchFilter}>
                    <Container>
                        <ul>
                            <li>
                                <FilterDropdown title="Category">
                                    {!!categories && categories.map(c => (
                                        <FilterDropdownItem
                                            key={c.id}
                                            value={c.id}
                                            name={c.name}
                                            selected={c.id === category}
                                            onSelect={this.onCategoryChange}
                                        >
                                            {c.name}
                                        </FilterDropdownItem>
                                    ))}
                                </FilterDropdown>
                            </li>
                            <li>
                                <a href="#sortBy">Sort by</a>
                            </li>
                            <li>
                                <a href="#global">Global</a>
                            </li>
                            <li className={classNames(styles.clearFilters, clearFiltersDisabled && styles.clearFiltersDisabled)}>
                                <a href="#" onClick={(e: SyntheticInputEvent<EventTarget>) => {
                                    e.preventDefault()
                                    if (!clearFiltersDisabled) {
                                        onClearFilters()
                                    }
                                }}>Clear all filters</a>
                            </li>
                        </ul>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Search
