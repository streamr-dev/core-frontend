// @flow

import React, { Component, type Node } from 'react'
import { Translate } from '@streamr/streamr-layout'
import classNames from 'classnames'

import Buttons, { type Props as ButtonsProps } from '../../Buttons'
import ModalDialog, { type Props as ModalDialogProps } from '../../ModalDialog'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import HelpToggle from './HelpToggle'

import styles from './dialog.pcss'

type Props = {
    title?: string,
    children?: Node,
    helpText?: Node,
    waiting?: boolean,
    className?: string,
    contentClassName?: string,
    onClose: () => void,
} & ButtonsProps & ModalDialogProps

type State = {
    isHelpOpen: boolean,
}

class Dialog extends Component<Props, State> {
    static defaultProps = {
        title: '',
        helpText: null,
        waiting: false,
    }

    state = {
        isHelpOpen: false,
    }

    onHelpToggle = () => {
        this.setState({
            isHelpOpen: !this.state.isHelpOpen,
        })
    }

    render() {
        const {
            title,
            children,
            waiting,
            helpText,
            actions,
            className,
            contentClassName,
            onClose,
            ...otherProps
        } = this.props
        const { isHelpOpen } = this.state

        return (
            <ModalDialog className={classNames(styles.dialog, className)} onClose={() => onClose && onClose()} {...otherProps}>
                <Container>
                    <TitleBar>
                        {title}
                        {!!helpText && (
                            <HelpToggle active={isHelpOpen} onToggle={this.onHelpToggle} />
                        )}
                    </TitleBar>
                    <ContentArea className={contentClassName}>
                        {(!helpText || !isHelpOpen) && (!waiting ? children : (
                            <div>
                                <Translate value="modal.dialog.waiting" />
                            </div>
                        ))}
                        {(!!helpText && isHelpOpen) && helpText}
                    </ContentArea>
                    {!waiting && (!helpText || !this.state.isHelpOpen) && (
                        <Buttons className={styles.buttons} actions={actions} />
                    )}
                </Container>
            </ModalDialog>
        )
    }
}

export default Dialog
