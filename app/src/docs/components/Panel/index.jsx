// @flow

import * as React from 'react'

import styles from './panel.pcss'

type Props = {
    children: React.Node,
}

const Panel = ({ children }: Props) => (
    <div className={styles.root}>
        {children}
    </div>
)

export default Panel
