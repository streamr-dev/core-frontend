import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { DESKTOP } from '~/shared/utils/styled'

type Shift = 'left' | 'right'

export function Tip({
    handle = <div />,
    children,
    shift,
}: {
    handle?: ReactNode
    children?: ReactNode
    shift?: Shift
}) {
    return (
        <TipRoot $shift={shift}>
            {handle}
            <TipBody>
                <TipEffects />
                <TipContent>{children}</TipContent>
            </TipBody>
        </TipRoot>
    )
}

const TipBody = styled.div`
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    left: 50%;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transform: translateY(-100%) translateX(-100%) translateX(24px);
    transition: 350ms;
    transition-property: visibility, opacity, transform;
    transition-delay: 350ms, 0s, 0s;
    visibility: hidden;
    white-space: normal;
`

const TipContent = styled.div`
    color: #525252;
    font-size: 12px;
    line-height: 1.5em;
    max-width: 240px;
    padding: 8px 12px;
    position: relative;
    width: max-content;

    > ul,
    > p {
        margin: 0;
    }

    > p + ul,
    > ul + p,
    > p + p {
        margin-top: 0.5em;
    }

    > ul li + li {
        margin-top: 0.25em;
    }

    > ul {
        list-style: none;
        padding: 0 0 0 12px;
        position: relative;
    }

    > ul li::before {
        content: '•';
        display: block;
        position: absolute;
        left: 0;
    }
`

const TipEffects = styled.div`
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    ::after {
        background: #ffffff;
        border-radius: 8px;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    ::before {
        background: #ffffff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
            0 5px 15px rgba(0, 0, 0, 0.1);
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        top: 100%;
        left: 100%;
        transform: translate(-50%, -50%) translateX(-24px) translateY(-4px) rotate(45deg);
    }
`

export const TipRoot = styled.div<{ $shift?: Shift }>`
    width: max-content;
    position: relative;

    :hover ${TipBody} {
        opacity: 1;
        visibility: visible;
        transition-delay: 0s;
        transform: translateY(-100%) translateX(-100%) translateX(24px) translateY(-8px);
    }

    // Default to center only after DESKTOP
    @media ${DESKTOP} {
        ${TipEffects}::before {
            left: 50%;
            transform: translate(-50%, -50%) translateY(-4px) rotate(45deg);
        }

        :hover ${TipBody} {
            transform: translateY(-100%) translateY(-8px) translateX(-50%);
        }

        ${TipBody} {
            transform: translateY(-100%) translateX(-50%);
        }

        // Allow shifting only after DESKTOP because it will overflow the page
        // on smaller screens
        ${({ $shift }) =>
            $shift === 'left' &&
            css`
                ${TipEffects}::before {
                    left: 100%;
                    transform: translate(-50%, -50%) translateX(-24px) translateY(-4px)
                        rotate(45deg);
                }

                ${TipBody} {
                    transform: translateY(-100%) translateX(-100%) translateX(24px);
                }

                :hover ${TipBody} {
                    transform: translateY(-100%) translateX(-100%) translateX(24px)
                        translateY(-8px);
                }
            `}

        ${({ $shift }) =>
            $shift === 'right' &&
            css`
                ${TipEffects}::before {
                    left: 0%;
                    transform: translate(-50%, -50%) translateX(24px) translateY(-4px)
                        rotate(45deg);
                }

                ${TipBody} {
                    transform: translateY(-100%) translateX(-24px);
                }

                :hover ${TipBody} {
                    transform: translateY(-100%) translateX(-24px) translateY(-8px);
                }
            `}
    }
`

export const TipIconWrap = styled.div<{
    $color?: string
    $svgSize?: { width: string; height: string }
}>`
    color: ${({ $color = 'inherit' }) => $color};

    span[role='img'],
    svg {
        display: block;
        ${({ $svgSize }) => {
            if ($svgSize) {
                return css`
                    width: ${$svgSize.width};
                    height: ${$svgSize.height};
                `
            }
        }}
    }
`
