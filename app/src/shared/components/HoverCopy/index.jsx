// @flow

import React, { type Node } from 'react'
import styled, { css } from 'styled-components'

import useCopy from '$shared/hooks/useCopy'
import SvgIcon from '$shared/components/SvgIcon'
import Tooltip from '$shared/components/Tooltip'

export type Props = {
    value: string,
    children?: Node,
}

const Container = styled.div``

const Icon = styled(SvgIcon)`
    display: none;
    height: 12px;
    color: #525252;
    margin-bottom: 2px;
    margin-left: 8px;

    ${Container}:hover & {
        display: inline-flex;
    }
`

const CopyIcon = styled(Icon)`
    cursor: pointer;

    :hover {
        color: #0324FF;
    }
`

const CopiedIcon = styled(Icon)`
    color: #0324FF;
`

const HoverCopy = ({ value, children }: Props) => {
    const { copy, isCopied } = useCopy()

    return (
        <Container>
            {children}
            <Tooltip value={isCopied ? 'Copied' : 'Copy to clipboard'}>
                {!isCopied && (
                    <CopyIcon name="clipboardPlus" onClick={() => copy(value)} />
                )}
                {isCopied && (
                    <CopiedIcon
                        name="clipboardCheck"
                        css={isCopied && css`
                            display: inline-flex;
                        `}
                    />
                )}
            </Tooltip>
        </Container>
    )
}

export default HoverCopy
