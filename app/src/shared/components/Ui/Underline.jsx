// @flow

import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import * as Colors from '$ui/StateColors'

const animation = keyframes`
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

const UnstyledUnderline = (props: any) => (
    <div {...props}>
        <div />
    </div>
)

const Underline = styled(UnstyledUnderline)`
    background-color: ${Colors.DEFAULT};
    height: 1px;
    position: relative;
    transition: background-color 200ms;

    input:focus + & {
        background-color: ${Colors.ACTIVE};
    }

    ${({ state }) => Colors[state] && css`
        input + && {
            background-color: ${Colors[state]};
        }
    `}

    ${({ state }) => state === 'PROCESSING' && css`
        transition: none;
    `}

    > div {
        background-color: #0424FF;
        display: none;
        height: 100%;
        position: absolute;

        ${({ state }) => state === 'PROCESSING' && css`
            animation: 1200ms infinite;
            animation-name: ${animation};
            display: block;
        `}
    }
`

export default Underline
