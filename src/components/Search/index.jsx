// @flow

import React, { Component } from 'react'
import classNames from 'classnames'

import { Container } from '@streamr/streamr-layout'
import SearchInput from './SearchInput'
import styles from './search.pcss'

import type { Filter, SearchFilter } from '../../flowtype/product-types'

export type Props = {
    filter: Filter,
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

    render() {
        const { filter: { search, category }, onClearFilters } = this.props
        const clearFiltersDisabled = !(search || category)

        return (
            <div className={styles.search}>
                <SearchInput value={search} onChange={this.onSearchChange} />
                <div className={styles.searchFilter}>
                    <Container>
                        <ul>
                            <li>
                                <a href="#category">Category</a>
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
