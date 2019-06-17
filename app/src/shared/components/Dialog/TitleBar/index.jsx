// @flow

import React, { type Node } from 'react'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './titleBar.pcss'

export type Props = {
    showCloseIcon?: boolean,
    onClose?: () => void,
    children?: Node,
}

export const TitleBar = ({ showCloseIcon, onClose, children }: Props) => (
    <div className={styles.modalTitle}>
        {children}
        {!!showCloseIcon && (
            <button onClick={onClose} className={styles.closeButton}>
                <SvgIcon name="crossHeavy" className={styles.closeIcon} />
            </button>
        )}
    </div>
)

export default TitleBar
