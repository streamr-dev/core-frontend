import React, { HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useDiscardableEffect } from 'toasterhea'
import { useLayoutEffect, useReducer, useRef, useState } from 'react'

const toastIn = keyframes`
    from {
        transform: translateX(100%) translateZ(0);
    }
    to {
        transform: translateX(0) translateZ(0);
    }
`

const toastSqueeze = keyframes`
    from {
        transform: translateX(100%) translateZ(0);
    }
    to {
        height: 0;
        margin-top: 0;
        margin-left: 0;
        transform: translateX(100%) translateZ(0);
    }
`

const toastOut = keyframes`
    from {
        transform: translateX(0) translateZ(0);
    }
    to {
        transform: translateX(100%) translateZ(0);
    }
`

export default function AbstractToast({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
    const [hidden, hide] = useReducer(() => true, false)

    const [squeezed, squeeze] = useReducer(() => true, false)

    const [height, setHeight] = useState(0)

    const ref = useRef<HTMLDivElement>(null)

    const innerRef = useRef<HTMLDivElement>(null)

    const mountedAtRef = useRef(performance.now())

    useDiscardableEffect((discard) => {
        const { current: root } = ref

        root?.addEventListener('animationend', ({ animationName }: AnimationEvent) => {
            if (animationName === 'toastOut') {
                squeeze()
            }

            if (animationName === 'toastSqueeze') {
                discard()
            }
        })

        /**
         * Let's make sure each open toast stays visible for at least a second. Otherwise
         * it's jumpy and a bit confusing.
         */
        setTimeout(hide, Math.max(0, 1000 - (performance.now() - mountedAtRef.current)))
    })

    useLayoutEffect(() => {
        const { current: root } = innerRef

        if (!root) {
            return
        }

        const { height } = root.getBoundingClientRect()

        setHeight(height)
    }, [children])

    return (
        <Root
            ref={ref}
            style={{
                height: `${height}px`,
            }}
            $hidden={hidden}
            $squeezed={squeezed}
        >
            <div {...props} ref={innerRef}>
                {children}
            </div>
        </Root>
    )
}

const Root = styled.div<{ $hidden?: boolean; $squeezed?: boolean }>`
    transition: 200ms height;
    margin-top: 12px;
    margin-left: 24px;

    ${({ $hidden, $squeezed }) => {
        if (!$hidden) {
            return css`
                animation: 0.15s 1 ${toastIn} both ease-in;
            `
        }

        if ($squeezed) {
            return css`
                animation: 0.15s 1 ${toastSqueeze} forwards ease-in;
            `
        }

        return css`
            animation: 0.15s 1 ${toastOut} forwards ease-in;
        `
    }}
`
