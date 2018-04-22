// @flow

import React from 'react'
import type { Node } from 'react'
import ReactModal2 from 'react-modal2'
import classNames from 'classnames'

import './accessibility'
import styles from './modaldialog.pcss'

type Props = {
    onClose: () => void,
    children: Node,
    className?: string,
    lightBackdrop?: boolean,
    backdropClassName?: string,
}

const ModalDialog = ({
    onClose,
    children,
    className,
    lightBackdrop,
    backdropClassName,
}: Props) => (
    <ReactModal2
        onClose={onClose}
        backdropClassName={classNames(backdropClassName, (lightBackdrop ? styles.lightBackdrop : styles.backdrop))}
        modalClassName={classNames(className, styles.dialog)}
    >
        {children}
    </ReactModal2>
)

ModalDialog.defaultProps = {
    darkBackdrop: false,
}

export default ModalDialog
