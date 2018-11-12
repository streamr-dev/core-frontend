// @flow

import * as React from 'react'
import { SortableElement } from 'react-sortable-hoc'

import styles from './sortableItem.pcss'

type Props = {
    children: React.Node,
}

const SortableItem = ({ children }: Props) => (
    <li
        className={styles.root}
    >
        {children}
    </li>
)

export default SortableElement(SortableItem)
