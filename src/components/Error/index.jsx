// @flow

import React from 'react'
import styles from './error.pcss'

import type { ErrorInUi } from '../../flowtype/common-types'

type Props = {
    source: ?ErrorInUi,
}

const Error = ({ source }: Props) => (
    source ? (
        <div className={styles.error}>
            {source.message}
        </div>
    ) : null
)

export default Error
