// @flow

import React, { Component } from 'react'
import styles from './error.pcss'

import type { ErrorInUi } from '../../flowtype/common-types'

type Props = {
    source: ?ErrorInUi,
}

export default class Error extends Component<Props> {
    render() {
        const { source } = this.props

        return source ? (
            <div className={styles.error}>
                {source.message}
            </div>
        ) : null
    }
}
