import React, { HTMLAttributes, MutableRefObject, RefCallback } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { COLORS } from '~/shared/utils/styled'

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> {
    color?:
        | 'white'
        | 'gray'
        | 'green'
        | 'blue'
        | {
              stroke: string
              ring?: string
          }
    coverage?: number
    fixed?: boolean
    size?: number | 'medium' | 'large'
    strokeWidth?: number
    innerRef?: RefCallback<HTMLDivElement> | MutableRefObject<HTMLDivElement>
}

const rotate = keyframes`
    100% {
        transform: rotate(360deg);
    }
`

function UnstyledSpinner({
    coverage = 0.6,
    fixed = false,
    color = 'green',
    size: sizeProp = 16,
    strokeWidth = 2,
    innerRef,
    ...props
}: Props) {
    const size = sizeProp === 'medium' ? 22 : sizeProp === 'large' ? 40 : sizeProp

    const r = (size - strokeWidth) / 2

    const d = 2 * Math.PI * r

    const [ringColor = COLORS.spinnerBorder, strokeColor] = (() => {
        switch (color) {
            case 'green':
                return [, COLORS.greenSpinner]
            case 'blue':
                return [, COLORS.link]
            case 'white':
                return [, COLORS.primaryContrast]
            case 'gray':
                return [COLORS.primaryContrast, COLORS.spinnerBorder]
        }

        const { ring, stroke } = color

        return [ring, stroke]
    })()

    return (
        <SpinnerRoot
            {...props}
            $animate={!fixed}
            ref={innerRef}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            <svg viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    stroke={ringColor}
                    strokeLinecap="round"
                    strokeDasharray={`${d}, 0`}
                    strokeDashoffset="0"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeDasharray={`${coverage * d}, ${(1 - coverage) * d}`}
                    strokeDashoffset="0"
                />
            </svg>
        </SpinnerRoot>
    )
}

const SpinnerRoot = styled.div<{ $animate?: boolean }>`
    svg {
        display: block;
        transform: rotate(-90deg);
    }

    ${({ $animate = false }) =>
        $animate &&
        css`
            svg {
                animation: ${rotate} 1.1s linear infinite;
                transform: rotate(0);
            }
        `}
`

const Spinner = styled(UnstyledSpinner)``

export default Spinner
