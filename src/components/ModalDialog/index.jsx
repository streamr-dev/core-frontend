// @flow

import React from 'react'
import ReactModal2 from 'react-modal2'
import './accessibility'
import styles from './modaldialog.pcss'
import classNames from 'classnames'

import type { Node } from 'react'

type Props = {
    onClose: () => void,
    children: Node,
    className?: string,
    backdropClassName?: string,
}

const ModalDialog = ({ onClose, children, className, backdropClassName }: Props) => (
    <ReactModal2
        onClose={onClose}
        backdropClassName={classNames(backdropClassName, styles.backdrop)}
        modalClassName={classNames(className, styles.dialog)}
    >
        {children}
    </ReactModal2>
)

export default ModalDialog
