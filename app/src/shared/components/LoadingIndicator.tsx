import React from 'react'
import styled, { css, keyframes } from 'styled-components'

interface Props {
    loading?: boolean
    className?: string
}

export default function LoadingIndicator({ loading = false, ...props }: Props) {
    return (
        <Root {...props} $loading={loading}>
            <div />
        </Root>
    )
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
    height: 0;
    opacity: 0;
    transition: opacity 0.3s ease-out;
    will-change: opacity;

    ${({ $loading = false }) =>
        $loading &&
        css`
            opacity: 1;
        `}

    div {
        height: 2px;
        position: relative;
        overflow: hidden;
    }

    div:after {
        animation: 2s infinite ${animation};
        background: #0424ff;
    }

    div:after,
    div:before {
        content: '';
        display: block;
        height: 100%;
        position: absolute;
        width: 100%;
    }
`
