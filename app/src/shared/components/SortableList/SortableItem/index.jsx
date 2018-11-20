// @flow

import * as React from 'react'
import { SortableElement } from 'react-sortable-hoc'

import styles from './sortableItem.pcss'

type Props = {
    children: React.Node,
}

const SortableItem = ({ children }: Props) => (
    <div className={styles.root}>
        {children}
    </div>
)

export default SortableElement(SortableItem)
