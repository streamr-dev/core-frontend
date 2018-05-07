// @flow

import React from 'react'
import type { Node } from 'react'
import ReactModal2 from 'react-modal2'
import classNames from 'classnames'

import './accessibility'
import { disableScroll, enableScroll } from '../../utils/scroll'
import styles from './modaldialog.pcss'

export type Props = {
    onClose: () => void,
    children: Node,
    className?: string,
    backdropClassName?: string,
}

class ModalDialog extends React.Component<Props> {
    componentDidMount() {
        disableScroll()
    }

    componentWillUnmount() {
        enableScroll()
    }

    render() {
        const { onClose, children, className, backdropClassName } = this.props
        return (
            <ReactModal2
                onClose={onClose}
                backdropClassName={classNames(backdropClassName, styles.backdrop)}
                modalClassName={classNames(className, styles.dialog)}
            >
                {children}
            </ReactModal2>
        )
    }
}

export default ModalDialog
