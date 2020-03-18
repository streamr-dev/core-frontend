// @flow

import React, { type Node } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

import useCopy from '$shared/hooks/useCopy'

export type Props = {
    value: string,
    children?: Node,
}

const Container = styled.div``

const Content = styled.span`
    display: inline-flex;
    margin-left: 10px;
    width: ${(props) => props.width}px;
    color: #13013d;
`

const Button = styled(Content)`
    display: none;
    color: #0324ff;
    cursor: pointer;

    ${Container}:hover & {
        display: inline-flex;
    }
`

const HoverCopy = ({ value, children }: Props) => {
    const { copy, isCopied } = useCopy()
    const copyText = I18n.t('general.copy')
    const copiedText = I18n.t('general.copied')
    // Determine 'Content' element width by longest text so that we
    // will have static size and not change between copy and copied states.
    const maxLength = Math.max(copyText.length, copiedText.length)
    const width = maxLength * 6

    return (
        <Container>
            {children}
            {!isCopied && (
                <Button onClick={() => copy(value)} width={width}>
                    {copyText}
                </Button>
            )}
            {isCopied && (
                <Content width={width}>{copiedText}</Content>
            )}
        </Container>
    )
}

export default HoverCopy
