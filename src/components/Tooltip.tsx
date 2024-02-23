import React, { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Anchor, useBoundingClientRect } from './Anchor'

interface Props {
    anchorDisplay?: 'inline' | 'inline-block'
    children: ReactNode
    content: ReactNode
}

export function Tooltip({ children, content, anchorDisplay }: Props) {
    const [isOpen, toggle] = useState(false)

    useEffect(() => {
        /**
         * Let's dismiss tooltips on scroll to avoid temporarily
         * stranded-looking ones.
         */

        function scrollSpy() {
            toggle(false)
        }

        window.addEventListener('scroll', scrollSpy, true)

        return () => {
            window.removeEventListener('scroll', scrollSpy, true)
        }
    }, [])

    return (
        <Anchor
            component={TooltipComponent}
            componentProps={{
                children: content,
                visible: isOpen,
            }}
            display={anchorDisplay}
            onMouseEnter={() => void toggle(true)}
            onMouseLeave={() => void toggle(false)}
            translate={(r) => (r ? [r.x + r.width / 2, r.y + window.scrollY] : [0, 0])}
        >
            {children}
        </Anchor>
    )
}

interface TooltipComponentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'x' | 'y'> {
    x: number
    y: number
    visible?: boolean
}

function TooltipComponent({
    x,
    y,
    visible = false,
    children,
    ...props
}: TooltipComponentProps) {
    const ref = useRef<HTMLDivElement>(null)

    const dx = useBoundingClientRect(ref, (rect) => {
        if (!rect) {
            return 0
        }

        const { clientWidth } = document.documentElement

        if (x > clientWidth / 2) {
            return Math.min(0, clientWidth - x - rect.width / 2)
        }

        return -Math.min(0, x - rect.width / 2)
    })

    const [mounted, setMounted] = useState(visible)

    const [animated, setAnimated] = useState(visible)

    useEffect(() => {
        let mounted = true

        if (!visible) {
            return
        }

        setMounted(true)

        setTimeout(() => {
            if (mounted) {
                setAnimated(true)
            }
        })

        return () => {
            mounted = false
        }
    }, [visible])

    return (
        mounted && (
            <TooltipRoot
                {...props}
                onTransitionEnd={({ propertyName, target }) => {
                    /**
                     * In this block we remove the tooltip from DOM if its element
                     * becomes invisible.
                     */

                    if (propertyName !== 'visibility') {
                        return
                    }

                    if (!(target instanceof HTMLDivElement)) {
                        return
                    }

                    if (window.getComputedStyle(target).visibility === 'hidden') {
                        setAnimated(false)

                        setMounted(false)
                    }
                }}
                $visible={animated && visible}
                ref={ref}
                style={{
                    transform: `translate(${x | 0}px, ${
                        y | 0
                    }px) translate(-50%, -100%) translateY(-10px) translateX(${
                        dx | 0
                    }px)`,
                }}
            >
                <TooltipBody>
                    <Indicator
                        style={{
                            transform: `translate(-50%, -50%) translateY(-2px)  translateX(${
                                -dx | 0
                            }px) rotate(45deg)`,
                        }}
                    />
                    <TooltipContent>{children}</TooltipContent>
                </TooltipBody>
            </TooltipRoot>
        )
    )
}

const TooltipBody = styled.div`
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(4px);
    transition: 350ms transform;
    white-space: normal;
`

const TooltipRoot = styled.div<{ $visible?: boolean }>`
    left: 0;
    max-width: min(256px, 100%);
    opacity: 0;
    padding: 0 8px;
    pointer-events: none;
    position: absolute;
    top: 0;
    transition: 350ms;
    transition-delay: 350ms, 0s;
    transition-property: visibility, opacity;
    visibility: hidden;
    z-index: 9999;

    ${({ $visible = false }) =>
        $visible &&
        css`
            opacity: 1;
            pointer-events: auto;
            transition-delay: 0s;
            visibility: visible;

            ${TooltipBody} {
                transform: translateY(0);
            }
        `}
`

const TooltipContent = styled.div`
    background: white;
    border-radius: 8px;
    color: #525252;
    font-size: 12px;
    line-height: 1.5em;
    max-width: max-content;
    padding: 8px 12px;
    position: relative;
    width: 100%;

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

const Indicator = styled.div`
    background: white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    left: 50%;
    top: 100%;

    ::before {
        background: transparent;
        content: '';
        height: 12px;
        position: absolute;
        transform: rotate(-45deg) translateY(12px);
        width: 12px;
    }
`

export const TooltipIconWrap = styled.div<{
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
`
