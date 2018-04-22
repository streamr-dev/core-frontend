// @flow

import React, { Component, type Node } from 'react'

import Buttons, { type Props as ButtonsProps } from '../../Buttons'
import ModalDialog from '../../ModalDialog'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import styles from './dialog.pcss'

type Props = {
    title?: string,
    children?: Node,
    helpText?: Node,
    waiting?: boolean,
} & ButtonsProps

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

    render() {
        const {
            title,
            children,
            waiting,
            helpText,
            actions,
        } = this.props

        return (
            <ModalDialog onClose={() => {}} backdropClassName={styles.backdrop}>
                <Container>
                    <TitleBar>
                        {title}
                        {!!helpText && !this.state.isHelpOpen && (
                            <button onClick={() => this.setState({
                                isHelpOpen: true,
                            })}
                            >
                                ?
                            </button>
                        )}
                        {!!helpText && this.state.isHelpOpen && (
                            <button onClick={() => this.setState({
                                isHelpOpen: false,
                            })}
                            >
                                x
                            </button>
                        )}
                    </TitleBar>
                    <ContentArea>
                        {(!helpText || !this.state.isHelpOpen) && (!waiting ? children : (
                            <div>
                                Waiting...
                            </div>
                        ))}
                        {(!!helpText && this.state.isHelpOpen) && helpText}
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
