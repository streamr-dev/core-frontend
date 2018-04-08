// @flow

import React, { Component, type Node } from 'react'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import Actions from './Actions'

import type { Props as ActionProps } from './Actions'

type Props = {
    title?: string,
    children?: Node,
    helpText?: string | Node,
} & ActionProps

type State = {
    isHelpOpen: boolean,
}

class Dialog extends Component<Props, State> {
    defaultProps = {
        title: '',
        helpText: null,
    }

    state = {
        isHelpOpen: false,
    }

    render() {
        const { title, children, helpText, actions } = this.props

        return (
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
                    {(!helpText || !this.state.isHelpOpen) && children}
                    {(!!helpText && this.state.isHelpOpen) && helpText}
                </ContentArea>
                {(!helpText || !this.state.isHelpOpen) && (
                    <Actions actions={actions} />
                )}
            </Container>
        )
    }
}

export default Dialog
