// @flow

import React, { type Node } from 'react'

import Handle from '../Handle'
import styles from './fieldItem.pcss'

type Props = {
    children: Node,
}

const FieldItem = ({ children }: Props) => (
    <div className={styles.root}>
        <div className={styles.inner}>
            <Handle className={styles.handle} />
            {children}
        </div>
    </div>
)

FieldItem.styles = styles

export default FieldItem
