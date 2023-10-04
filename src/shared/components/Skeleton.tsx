import React from 'react'
import styled, { keyframes, css } from 'styled-components'

type Props = {
    children?: React.ReactNode
    disabled?: boolean
    width?: any
    block?: boolean
}

const UnstyledSkeleton: React.FunctionComponent<Props> = ({
    disabled,
    children,
    width: _width,
    block: _block,
    ...props
}: Props) => (disabled ? children || null : ((<span {...props}>&zwnj;</span>) as any))

const animation = keyframes`
    0% {
        background-position: -200px 0;
    }

    100% {
        background-position: calc(200px + 100%) 0;
    }
`

const Skeleton = styled(UnstyledSkeleton)<Props>`
    animation: ${animation} 1.2s ease-in-out infinite;
    background-color: #eeeeee;
    background-image: linear-gradient(90deg, #eeeeee, #f5f5f5, #eeeeee);
    background-repeat: no-repeat;
    background-size: 200px 100%;
    border-radius: 2px;
    display: inline-block;
    line-height: 1;
    width: 100%;

    ${({ width }) =>
        width != null &&
        css`
            width: ${width};
        `}

    ${({ block }) =>
        !!block &&
        css`
            border-radius: 0;
            display: block;
        `}
`
export default Skeleton
