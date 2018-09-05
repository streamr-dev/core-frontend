// @flow

import React, { type Node } from 'react'

import styles from './titlebar.pcss'

export type Props = {
    children?: Node,
}

export const TitleBar = ({ children }: Props) => (
    <div className={styles.modalTitle}>
        <h3>
            {children}
        </h3>
    </div>
)

export default TitleBar
