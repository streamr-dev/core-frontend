// @flow

import React from 'react'
import type { Node } from 'react'
import ReactModal2 from 'react-modal2'
import classNames from 'classnames'

import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import './accessibility'
import styles from './modalDialog.pcss'

export type Props = {
    onClose: () => void,
    className?: string,
    backdropClassName?: string,
}

export type InternalProps = Props & {
    children: Node,
}

const ModalDialog = ({ onClose, children, className, backdropClassName }: InternalProps) => (
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
