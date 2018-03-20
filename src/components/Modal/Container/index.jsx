// @flow

import React from 'react'

import styles from './container.pcss'

import type { Node } from 'react'

export type Props = {
    children?: Node,
}

export const Container = ({ children }: Props) => (
    <div className={styles.modalContainer}>
        {React.Children.toArray(children)}
    </div>
)

export default Container
