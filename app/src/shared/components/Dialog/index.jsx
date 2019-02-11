// @flow

import React, { Component, type Node } from 'react'
import classNames from 'classnames'

import Buttons, { type Props as ButtonsProps } from '$shared/components/Buttons'
import ModalDialog, { type Props as ModalDialogProps } from '$shared/components/ModalDialog'
import { dialogAutoCloseTimeout } from '$shared/utils/constants'
import Spinner from '$shared/components/Spinner'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import HelpToggle from './HelpToggle'

import styles from './dialog.pcss'

export type Props = {
    title?: string,
    children?: Node,
    helpText?: Node,
    waiting?: boolean,
    className?: string,
    contentClassName?: string,
    containerClassname?: string,
    actionsClassName?: string,
    onClose: () => void,
    showCloseIcon?: boolean,
    autoCloseAfter?: number, // in milliseconds, use this to close the dialog after a custom timeout
    autoClose?: boolean, // use this to close the dialog after default timeout
} & ButtonsProps & ModalDialogProps

type State = {
    isHelpOpen: boolean,
}

class Dialog extends Component<Props, State> {
    static defaultProps = {
        title: '',
        helpText: null,
        waiting: false,
        autoClose: false,
    }

    state = {
        isHelpOpen: false,
    }

    componentDidUpdate(prevProps: Props) {
        const { autoCloseAfter, autoClose, onClose } = this.props
        const timeout = autoCloseAfter || (autoClose && dialogAutoCloseTimeout) || null

        if (prevProps.autoCloseAfter !== timeout && timeout != null) {
            this.clearCloseTimeout()
            this.autoCloseTimeoutId = setTimeout(onClose, timeout)
        }
    }

    componentWillUnmount() {
        this.clearCloseTimeout()
    }

    onHelpToggle = () => {
        this.setState({
            isHelpOpen: !this.state.isHelpOpen,
        })
    }

    clearCloseTimeout = () => {
        if (this.autoCloseTimeoutId) {
            clearTimeout(this.autoCloseTimeoutId)
            this.autoCloseTimeoutId = null
        }
    }

    autoCloseTimeoutId = null

    render() {
        const {
            title,
            children,
            waiting,
            helpText,
            actions,
            className,
            contentClassName,
            containerClassname,
            actionsClassName,
            onClose,
            showCloseIcon,
            ...otherProps
        } = this.props
        const { isHelpOpen } = this.state

        return (
            <ModalDialog className={classNames(styles.dialog, className)} onClose={() => onClose && onClose()} {...otherProps}>
                <Container className={containerClassname}>
                    <TitleBar
                        showCloseIcon={showCloseIcon}
                        onClose={onClose}
                    >
                        {title}
                        {!!helpText && (
                            <HelpToggle active={isHelpOpen} onToggle={this.onHelpToggle} />
                        )}
                    </TitleBar>
                    <ContentArea className={contentClassName}>
                        {(!helpText || !isHelpOpen) && (!waiting ? children : (
                            <Spinner size="large" className={styles.spinner} />
                        ))}
                        {(!!helpText && isHelpOpen) && helpText}
                    </ContentArea>
                    {!waiting && (!helpText || !this.state.isHelpOpen) && (
                        <Buttons className={classNames(styles.buttons, actionsClassName)} actions={actions} />
                    )}
                </Container>
            </ModalDialog>
        )
    }
}

export default Dialog
