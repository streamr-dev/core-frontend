// @flow

import * as React from 'react'

import SortableList from '../SortableList'
import FieldItem from './FieldItem'
import styles from './fieldList.pcss'

type Props = {
    className?: string,
    children: React.Node,
}

const FieldList = ({ children, className, ...props }: Props) => (
    <SortableList
        className={styles.root}
        helperClass={FieldItem.styles.helper}
        lockAxis="y"
        {...props}
    >
        {children}
    </SortableList>
)

export default FieldList
