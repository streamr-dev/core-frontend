import React from 'react'
import styled, { css } from 'styled-components'

interface Props {
    alt: string
    color?: 'gray' | 'white'
    disabled?: boolean
    layout?: 'vertical'
}

export function Meatball({ alt, color, disabled, layout }: Props) {
    const vertical = layout === 'vertical'

    return (
        <Root $color={color} $disabled={disabled} data-test-hook="meatball">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vertical ? '0 0 4 20' : '0 0 20 4'}
                width={vertical ? '4' : '20'}
                height={vertical ? '20' : '4'}
                data-alt={alt}
            >
                <circle cx="2" cy="2" r="2" />
                <circle cx={vertical ? '2' : '10'} cy={vertical ? '10' : '2'} r="2" />
                <circle cx={vertical ? '2' : '18'} cy={vertical ? '18' : '2'} r="2" />
            </svg>
        </Root>
    )
}

const Root = styled.div<{ $color?: Props['color']; $disabled?: boolean }>`
    border: 1px solid transparent;
    border-radius: 2px;
    opacity: 0.5;
    padding: 5px;
    transition: 200ms ease-in-out;
    transition-property: border-color, opacity, box-shadow;

    svg {
        display: block;
    }

    circle {
        fill: var(--greyDark);
    }

    ${({ $disabled = false }) =>
        $disabled
            ? css`
                  cursor: not-allowed;
              `
            : css`
                  a:hover &,
                  a:focus &,
                  :hover,
                  :focus {
                      opacity: 1;
                      transition-duration: 50ms;
                  }
              `}

    ${({ $color, $disabled = false }) => propsToCss($disabled, $color)}
`

function propsToCss(
    disabled: boolean,
    color: Props['color'],
): ReturnType<typeof css> | undefined {
    if (color === 'white') {
        return css`
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.5);
            opacity: 1;

            circle {
                fill: var(--white);
            }

            ${!disabled &&
            css`
                :hover,
                :focus,
                .dropdown.show & {
                    border-color: var(--white);
                    box-shadow: inset 0 0 0 0.5px #ffffff;
                }
            `}
        `
    }

    if (color === 'gray') {
        return css`
            border: none;
            background-color: #efefef;
            opacity: 1;
            height: 1.5rem;
            width: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;

            circle {
                fill: var(--grey2);
            }

            ${!disabled &&
            css`
                :hover,
                :focus,
                .dropdown.show & {
                    background-color: #f8f8f8;
                }
            `}
        `
    }
}
