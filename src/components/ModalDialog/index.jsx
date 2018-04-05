// @flow

import React from 'react'
import ReactModal2 from 'react-modal2'
import './accessibility'
import styles from './modaldialog.pcss'

import type { Node } from 'react'

type Props = {
    onClose: () => void,
    children: Node,
    className?: string,
    backdropClassName?: string,
}

const ModalDialog = ({ onClose, children, className, backdropClassName }: Props) => {
    const backDropClassName = backdropClassName || styles.backdrop
    const dialogClassName = className || styles.dialog

    return (
        <ReactModal2
            onClose={onClose}
            backdropClassName={backDropClassName}
            modalClassName={dialogClassName}
        >
            {children}
        </ReactModal2>
    )
}

export default ModalDialog
