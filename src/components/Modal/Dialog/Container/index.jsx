// @flow

import React from 'react'
import type { Node } from 'react'

import styles from './container.pcss'

export type Props = {
    children?: Node,
}

export const Container = ({ children }: Props) => (
    <div className={styles.modalContainer}>
        {children}
    </div>
)

export default Container
