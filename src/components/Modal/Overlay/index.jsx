// @flow

import React from 'react'

import styles from './overlay.pcss'

export type Props = {
    children?: React$Node,
}

export const Overlay = ({ children }: Props) => (
    <div className={styles.modalOverlay}>
        {React.Children.toArray(children)}
    </div>
)

export default Overlay
