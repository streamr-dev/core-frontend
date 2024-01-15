import React from 'react'
import styled, { keyframes } from 'styled-components'

export function DottedLoadingIndicator() {
    return (
        <DottedLoadingIndicatorRoot>
            <Left />
            <Dot />
            <Right />
        </DottedLoadingIndicatorRoot>
    )
}

const animation = keyframes`
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(0);
    }
`

export const DottedLoadingIndicatorRoot = styled.div`
    display: grid;
    gap: 8px;
    grid-template-columns: 16px 16px 16px;
    margin: 0 auto;
    width: max-content;
`

const Dot = styled.div`
    animation: ${animation} 1s ease alternate infinite;
    animation-delay: 0.2s;
    background: #0052ec;
    border-radius: 50%;
    height: 16px;
    width: 16px;
`

const Left = styled(Dot)`
    animation-delay: 0s;
`

const Right = styled(Dot)`
    animation-delay: 0.4s;
`
