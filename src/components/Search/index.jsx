// @flow

import React from 'react'
import styles from './search.pcss'

type Props = {}

type State = {}

export default class Search extends React.Component<Props, State> {
    render() {
        return (
            <div className={styles.search}>
                <span>Search the Marketplace for…</span>
            </div>
        )
    }
}
