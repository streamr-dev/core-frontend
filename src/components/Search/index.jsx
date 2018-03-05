// @flow

import React from 'react'

import { Container } from '@streamr/streamr-layout'
import SearchInput from './SearchInput'
import styles from './search.pcss'

import type { Props as SearchInputProps } from './SearchInput'

export type Props = SearchInputProps & {}

export default class Search extends React.Component<Props> {
    render() {
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
                        </ul>
                    </Container>
                </div>
            </div>
        )
    }
}
