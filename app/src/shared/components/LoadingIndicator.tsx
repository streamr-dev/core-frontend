import React from 'react'
import styled, { css, keyframes } from 'styled-components'

interface Props {
    detached?: boolean
    loading?: boolean
    className?: string
}

export default function LoadingIndicator({ loading = false, detached = false, ...props }: Props) {
    return <Root {...props} $loading={loading} $detached={detached} />
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

const Root = styled.div<{ $loading?: boolean; $detached?: boolean }>`
    background: none;
    height: 2px;
    opacity: 0;
    overflow: hidden;
    position: ${({ $detached = false }) => $detached ? 'absolute' : 'relative'};
    transition: opacity 0.3s ease-out;
    width: 100%;
    will-change: opacity, transform;

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
        height: 100%;
        position: absolute;
        width: 100%;
    }
`
