// @flow

import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import * as Colors from '$shared/components/FormControlStateColors'

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

type Props = {
    className?: ?string,
    state?: $Keys<typeof Colors>,
}

const UnstyledFormControlUnderline = ({ className }: any) => (
    <div className={className}>
        <div />
    </div>
)

const FormControlUnderline = styled(UnstyledFormControlUnderline)`
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

export default FormControlUnderline
