// @flow

import React, { type Node } from 'react'

import styles from './titleBar.pcss'

export type Props = {
    children?: Node,
}

export const TitleBar = ({ children }: Props) => (
    <div className={styles.modalTitle}>
        {children}
    </div>
)

export default TitleBar
