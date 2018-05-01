// @flow

import React, { Component, type Node } from 'react'

import Buttons, { type Props as ButtonsProps } from '../../Buttons'
import ModalDialog, { type Props as ModalDialogProps } from '../../ModalDialog'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import HelpToggle from './HelpToggle'

export type Props = {
    title?: string,
    children?: Node,
    helpText?: Node,
    waiting?: boolean,
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
            onClose,
            ...otherProps
        } = this.props
        const { isHelpOpen } = this.state

        return (
            <ModalDialog onClose={() => onClose && onClose()} {...otherProps}>
                <Container>
                    <TitleBar>
                        {title}
                        {!!helpText && (
                            <HelpToggle active={isHelpOpen} onToggle={this.onHelpToggle} />
                        )}
                    </TitleBar>
                    <ContentArea>
                        {(!helpText || !isHelpOpen) && (!waiting ? children : (
                            <div>
                                Waiting...
                            </div>
                        ))}
                        {(!!helpText && isHelpOpen) && helpText}
                    </ContentArea>
                    {!waiting && (!helpText || !this.state.isHelpOpen) && (
                        <Buttons actions={actions} />
                    )}
                </Container>
            </ModalDialog>
        )
    }
}

export default Dialog
