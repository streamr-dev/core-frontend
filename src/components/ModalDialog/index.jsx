// @flow

import React from 'react'
import ReactModal2 from 'react-modal2'
import styles from './modaldialog.pcss'

import type { Node } from 'react'

type Props = {
    onClose: () => void,
    children: Node,
    className?: string,
    backdropClassName?: string,
}

// This is needed for accessibility
ReactModal2.getApplicationElement = () => document.getElementById('app')

const ModalDialog = ({ onClose, children, className, backdropClassName }: Props) => {
    const backDropStyle = backdropClassName || styles.backdrop
    const dialogStyle = className || styles.dialog

    return (
        <ReactModal2
            onClose={onClose}
            backdropClassName={backDropStyle}
            modalClassName={dialogStyle}
        >
            {children}
        </ReactModal2>
    )
}

export default ModalDialog
