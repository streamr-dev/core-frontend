// @flow

import React from 'react'

import styles from './overlay.pcss'

import type { Node } from 'react'

export type Props = {
    children?: Node,
}

export const Overlay = ({ children }: Props) => (
    <div className={styles.modalOverlay}>
        {React.Children.toArray(children)}
    </div>
)

export default Overlay
