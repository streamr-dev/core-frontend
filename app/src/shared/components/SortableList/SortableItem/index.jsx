// @flow

import * as React from 'react'
import cx from 'classnames'
import { SortableElement } from 'react-sortable-hoc'

import styles from './sortableItem.pcss'

type Props = {
    children: React.Node,
    className?: string,
}

const SortableItem = ({ children, className, ...props }: Props) => (
    <div className={cx(styles.root, className)} {...props}>
        {children}
    </div>
)

export default SortableElement(SortableItem)
