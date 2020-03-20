// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './titleBar.pcss'

export type Props = {
    showCloseIcon?: boolean,
    onClose?: () => void,
    children?: Node,
    className?: string,
}

export const TitleBar = ({ showCloseIcon, onClose, children, className }: Props) => (
    <div className={cx(styles.modalTitle, className)}>
        {children}
        {!!showCloseIcon && (
            <button onClick={onClose} className={styles.closeButton}>
                <SvgIcon name="crossHeavy" className={styles.closeIcon} />
            </button>
        )}
    </div>
)

export default TitleBar
