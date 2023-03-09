import React, { Component, ReactNode } from 'react'
import classNames from 'classnames'
import type { Props as ButtonsProps, ButtonActions } from '$shared/components/Buttons'
import Buttons from '$shared/components/Buttons'
import type { Props as ModalDialogProps } from '$shared/components/ModalDialog'
import ModalDialog from '$shared/components/ModalDialog'
import { dialogAutoCloseTimeout } from '$shared/utils/constants'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import HelpToggle from './HelpToggle'
import styles from './dialog.pcss'
export type DialogProps = {
    title?: ReactNode
    children?: ReactNode
    helpText?: ReactNode
    waiting?: boolean
    disabled?: boolean
    className?: string
    contentClassName?: string
    containerClassname?: string
    actionsClassName?: string
    backdropClassName?: string
    useDarkBackdrop?: boolean,
    titleClassName?: string
    onClose: () => void
    showCloseIcon?: boolean
    autoCloseAfter?: number
    // in milliseconds, use this to close the dialog after a custom timeout
    autoClose?: boolean
    // use this to close the dialog after default timeout
    renderActions?: (arg0: ButtonActions) => ReactNode
} & ButtonsProps &
    ModalDialogProps
type State = {
    isHelpOpen: boolean
}

class Dialog extends Component<DialogProps, State> {
    static defaultProps: Partial<DialogProps> = {
        title: '',
        helpText: null,
        waiting: false,
        autoClose: false,
        useDarkBackdrop: false,
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

    componentDidUpdate(prevProps: DialogProps) {
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
            disabled,
            helpText,
            actions,
            className,
            contentClassName,
            containerClassname,
            actionsClassName,
            backdropClassName,
            useDarkBackdrop,
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
                backdropClassName={classNames(styles.backdrop, backdropClassName, useDarkBackdrop ? styles.darkBackdrop : null)}
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
                        {!!helpText && <HelpToggle active={isHelpOpen} onToggle={this.onHelpToggle} />}
                    </TitleBar>
                    {(!helpText || !isHelpOpen) && !!waiting && <LoadingIndicator loading />}
                    <ContentArea className={classNames(styles.content, contentClassName)}>
                        {(!helpText || !isHelpOpen) && !waiting && children}
                        {!!helpText && isHelpOpen && helpText}
                    </ContentArea>
                    {!waiting && (!helpText || !this.state.isHelpOpen) && !renderActions && (
                        <Buttons className={classNames(styles.buttons, actionsClassName)} actions={actions} />
                    )}
                    {!waiting && (!helpText || !this.state.isHelpOpen) && renderActions && renderActions(actions || {})}
                </Container>
                {!!disabled && <div className={styles.disabledModal} />}
            </ModalDialog>
        )
    }
}

export default Dialog
