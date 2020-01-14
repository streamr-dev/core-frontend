// @flow

import React, { type ComponentType } from 'react'
import styled, { keyframes, css } from 'styled-components'

const underlineAnimation = keyframes`
    0% {
        left: 0%;
        right: 100%;
    }

    33% {
        left: 0%;
        right: 0%;
    }

    67% {
        left: 0%;
        right: 0%;
    }

    100% {
        left: 100%;
        right: 0%;
    }
`

const colors = {
    active: '#0424FF',
    success: '#2AC437',
    caution: '#F9CF0D',
    error: '#FF0F2D',
}

type Props = {
    className?: ?string,
    underline?: string,
}

const UnderlineDecorator = (WrappedComponent: ComponentType<any>) => {
    const WrappedWrappedComponent = ({ underline, className, ...props }: Props) => (
        <div className={className}>
            <WrappedComponent {...props} />
        </div>
    )

    const StyledWrappedComponent = styled(WrappedWrappedComponent)`
        position: relative;
        max-width: 488px;

        ::after,
        ::before {
            bottom: 0;
            content: '';
            height: 1px;
            position: absolute;
            z-index: 1;
        }

        ::after {
            display: none;

            ${({ underline }) => underline === 'processing' && css`
                animation: 1200ms infinite;
                animation-name: ${underlineAnimation};
                background-color: #0424FF;
                display: block;
            `}
        }

        ::before {
            background-color: ${({ underline }) => colors[underline] || '#323232'};
            display: block;
            transition: background-color 200ms;
            width: 100%;

            ${({ underline }) => underline === 'processing' && css`
                opacity: 0.25;
                transition: none;
            `}
        }
    `

    const UnderlineDecoratorWrapper = ({ underline, ...props }: Props) => (
        !underline ? (
            <WrappedComponent {...props} />
        ) : (
            <StyledWrappedComponent {...props} underline={underline} />
        )
    )

    return UnderlineDecoratorWrapper
}

export default UnderlineDecorator
