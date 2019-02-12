// @flow

import * as React from 'react'

import styles from './warning.pcss'

type Props = {
    children: React.Node,
}

const Warning = ({ children }: Props) => (
    <div className={styles.root}>
        <span className={styles.warningIcon} />
        {children}
    </div>
)

export default Warning
