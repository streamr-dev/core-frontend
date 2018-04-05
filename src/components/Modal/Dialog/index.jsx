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
} & ActionProps

export const Dialog = ({ title, children, actions }: Props) => (
    <Container>
        <TitleBar>{title}</TitleBar>
        <ContentArea>
            {React.Children.toArray(children)}
        </ContentArea>
        <Actions actions={actions} />
    </Container>
)

Dialog.defaultProps = {
    title: '',
}

export default Dialog
