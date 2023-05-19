import React from 'react'
import styled, { css, keyframes } from 'styled-components'

interface Props {
    loading?: boolean
    className?: string
}

export default function LoadingIndicator({ loading = false, ...props }: Props) {
    return <Root {...props} $loading={loading} />
}

const animation = keyframes`
    0% {
        transform: translateX(-100%) translateZ(0);
    }

    45% {
        transform: translateX(0%) translateZ(0);
    }

    55% {
        transform: translateX(0%) translateZ(0);
    }

    100% {
        transform: translateX(100%) translateZ(0);
    }
`

const Root = styled.div<{ $loading?: boolean }>`
    background: none;
    opacity: 0;
    overflow: hidden;
    position: relative;
    transition: opacity 0.3s ease-out;
    width: 100%;
    will-change: opacity;

    ${({ $loading = false }) => $loading && css`
        opacity: 1;
    `}

    :after {
        animation: 2s infinite ${animation};
        background: #0424FF;
    }
    
    :after,
    :before {
        content: '';
        display: block;
        height: 2px;
        position: absolute;
        width: 100%;
    }
`
