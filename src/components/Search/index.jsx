// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'
import styles from './search.pcss'

type Props = {}

type State = {}

export default class Search extends React.Component<Props, State> {
    render() {
        return (
            <div className={styles.search}>
                <div className={styles.searchInput}>
                    <span>Search the Marketplace for…</span>
                </div>
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
