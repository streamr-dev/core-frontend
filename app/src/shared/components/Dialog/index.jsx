// @flow

import React, { Component, type Node } from 'react'
import classNames from 'classnames'

import Buttons, { type Props as ButtonsProps, type ButtonActions } from '$shared/components/Buttons'
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
    backdropClassName?: string,
    titleClassName?: string,
    onClose: () => void,
    showCloseIcon?: boolean,
    autoCloseAfter?: number, // in milliseconds, use this to close the dialog after a custom timeout
    autoClose?: boolean, // use this to close the dialog after default timeout
    renderActions?: (ButtonActions) => Node,
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

    static classNames = {
        dialog: styles.dialog,
        backdrop: styles.backdrop,
        container: styles.container,
        title: styles.title,
        content: styles.content,
        buttons: styles.buttons,
    }

    state = {
        isHelpOpen: false,
    }

    componentDidMount() {
        const { autoCloseAfter, autoClose, onClose } = this.props
        const timeout = autoCloseAfter || (autoClose && dialogAutoCloseTimeout) || null

        if (timeout != null) {
            this.clearCloseTimeout()
            this.autoCloseTimeoutId = setTimeout(onClose, timeout)
        }
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
            backdropClassName,
            titleClassName,
            onClose,
            showCloseIcon,
            renderActions,
            ...otherProps
        } = this.props
        const { isHelpOpen } = this.state

        return (
            <ModalDialog
                className={classNames(styles.dialog, className)}
                backdropClassName={classNames(styles.backdrop, backdropClassName)}
                onClose={() => onClose && onClose()}
                {...otherProps}
            >
                <Container className={classNames(styles.container, containerClassname)}>
                    <TitleBar
                        showCloseIcon={showCloseIcon}
                        onClose={onClose}
                        className={classNames(styles.title, titleClassName)}
                    >
                        {title}
                        {!!helpText && (
                            <HelpToggle active={isHelpOpen} onToggle={this.onHelpToggle} />
                        )}
                    </TitleBar>
                    <ContentArea className={classNames(styles.content, contentClassName)}>
                        {(!helpText || !isHelpOpen) && (!waiting ? children : (
                            <Spinner size="large" className={styles.spinner} />
                        ))}
                        {(!!helpText && isHelpOpen) && helpText}
                    </ContentArea>
                    {!waiting && (!helpText || !this.state.isHelpOpen) && !renderActions && (
                        <Buttons className={classNames(styles.buttons, actionsClassName)} actions={actions} />
                    )}
                    {!waiting && (!helpText || !this.state.isHelpOpen) && renderActions && renderActions(actions || {})}
                </Container>
            </ModalDialog>
        )
    }
}

export default Dialog
