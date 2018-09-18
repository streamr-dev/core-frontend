// @flow

import React from 'react'
import type { Node } from 'react'
import ReactModal2 from 'react-modal2'
import classNames from 'classnames'

import BodyClass, { NO_SCROLL } from '../BodyClass'
import './accessibility'
import styles from './modalDialog.pcss'

export type Props = {
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
        <BodyClass className={NO_SCROLL} />
        {children}
    </ReactModal2>
)

export default ModalDialog
