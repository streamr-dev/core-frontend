// @flow

import React from 'react'

import { Container } from '@streamr/streamr-layout'
import SearchInput from './SearchInput'
import styles from './search.pcss'

import type { Props as SearchInputProps } from './SearchInput'

export type Props = SearchInputProps & {
    clearFiltersDisabled: boolean,
    onClearFilters: () => void,
}

class Search extends React.Component<Props> {
    static defaultProps = {
        clearFiltersDisabled: true,
        onClearFilters: () => {},
    }

    render() {
        const { clearFiltersDisabled, onClearFilters } = this.props

        return (
            <div className={styles.search}>
                <SearchInput {...this.props} />
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
                            <li className={styles.clearFilters}>
                                {clearFiltersDisabled && (
                                    <span className={styles.clearFiltersDisabled}>Clear all filters</span>
                                )}
                                {!clearFiltersDisabled && (
                                    <a href="#" onClick={(e: SyntheticInputEvent<EventTarget>) => {
                                        e.preventDefault()
                                        onClearFilters()
                                    }}>Clear all filters</a>
                                )}
                            </li>
                        </ul>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Search
