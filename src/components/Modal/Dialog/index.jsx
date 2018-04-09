// @flow

import React, { type Node } from 'react'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import Actions from './Actions'

import type { Props as ActionProps } from './Actions'

type Props = {
    title?: string,
    children?: Node,
    waiting: boolean,
} & ActionProps

export const Dialog = ({ title, children, actions, waiting }: Props) => (
    <Container>
        <TitleBar>{title}</TitleBar>
        <ContentArea>
            {!waiting ? children : (
                <div>
                    Waiting...
                </div>
            )}
        </ContentArea>
        <Actions actions={!waiting ? actions : {}} />
    </Container>
)

Dialog.defaultProps = {
    title: '',
    waiting: false,
}

export default Dialog
