import React, { ReactNode, useEffect, useReducer, useRef } from 'react'
import styled, { createGlobalStyle, css, keyframes } from 'styled-components'
import { useDiscardableEffect } from 'toasterhea'
import gsap from 'gsap'
import { TABLET } from '~/shared/utils/styled'

const bringIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(1%) translateZ(0) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateZ(0) scale(1) translateY(0);
    }
`

const bringOut = keyframes`
    from {
        transform: translateZ(0) scale(1) translateY(0);
    }
    to {
        transform: translateY(1%) translateZ(0) scale(0.98);
    }
`

const fadeAway = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

export const RejectionReason = {
    CloseButton: Symbol('close button'),
    Backdrop: Symbol('backdrop'),
    EscapeKey: Symbol('escape key'),
    CancelButton: Symbol('cancel'),
    BackButton: Symbol('back button'),
}

export interface BaseModalProps {
    children?: ReactNode | ((close: (reason?: unknown) => void) => ReactNode)
    onReject?: (reason?: any) => void
    onBeforeAbort?: (reason?: any) => boolean | null | void
    darkBackdrop?: boolean
}

export default function BaseModal({
    children,
    onReject,
    onBeforeAbort,
    darkBackdrop,
}: BaseModalProps) {
    const [dismissed, dismiss] = useReducer(() => true, false)

    const rootRef = useRef<HTMLDivElement>(null)

    useDiscardableEffect((discard) => {
        const { current: root } = rootRef

        root?.addEventListener('animationend', ({ animationName }) => {
            if (animationName === fadeAway.getName()) {
                discard()
            }
        })

        dismiss()
    })

    const wigglyRef = useRef<HTMLDivElement>(null)

    const tweenRef = useRef<ReturnType<typeof gsap.to>>()

    function wiggle() {
        tweenRef.current?.kill()

        tweenRef.current = gsap.to(
            {},
            {
                duration: 0.75,
                onUpdate() {
                    const { current: wiggly } = wigglyRef

                    if (!wiggly) {
                        return
                    }

                    const p = this.progress()

                    const intensity = (1 + Math.sin((p * 2 - 0.5) * Math.PI)) * 0.5

                    const wave = 5 * Math.sin(6 * p * Math.PI)

                    wiggly.style.transform = `rotate(${intensity * wave}deg)`
                },
            },
        )
    }

    function close(reason?: any) {
        const beforeAbort = onBeforeAbort?.(reason)

        if (beforeAbort === false) {
            wiggle()
        }

        if (beforeAbort === null || beforeAbort === false) {
            return
        }

        onReject?.(reason)
    }

    const closeRef = useRef(close)

    closeRef.current = close

    useEffect(() => {
        function onKeyDown({ key }: KeyboardEvent) {
            if (key === 'Escape') {
                closeRef.current(RejectionReason.EscapeKey)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    return (
        <Root ref={rootRef} $dismissed={dismissed} $dark={darkBackdrop}>
            <NoScrollStyles />
            <Backdrop onMouseDown={() => void close(RejectionReason.Backdrop)} />
            <OuterWrap>
                <InnerWrap>
                    <Pad>
                        <Interactive>
                            <AnimatedWrap $dismissed={dismissed}>
                                <Wigglable ref={wigglyRef}>
                                    {typeof children === 'function'
                                        ? children(close)
                                        : children}
                                </Wigglable>
                            </AnimatedWrap>
                        </Interactive>
                    </Pad>
                </InnerWrap>
            </OuterWrap>
        </Root>
    )
}

const NoScrollStyles = createGlobalStyle`
    body {
        overflow: hidden !important;
        overflow-y: hidden !important;
        overflow-x: hidden !important;
    }
`

const AnimatedWrap = styled.div<{ $dismissed?: boolean }>`
    animation: 300ms ${({ $dismissed = false }) => ($dismissed ? bringOut : bringIn)}
        ease-in-out 1;
    animation-fill-mode: both;
    backface-visibility: hidden;
`

const Root = styled.div<{ $dismissed?: boolean; $dark?: boolean }>`
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.9);
    height: 100%;
    left: 0;
    line-height: 24px;
    overflow: auto;
    position: fixed;
    top: 0;
    transform: translate3d(0, 0, 0);
    width: 100%;
    z-index: 1;

    ${({ $dismissed = false }) =>
        $dismissed &&
        css`
            animation: 300ms ${fadeAway} ease-in-out 1;
            animation-fill-mode: both;
        `}

    ${({ $dark = false }) =>
        $dark &&
        css`
            background-color: rgba(50, 50, 50, 0.5);
        `}
`

const Backdrop = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
`

const OuterWrap = styled.div`
    align-items: center;
    color: #323232;
    display: flex;
    height: 100%;
    justify-content: center;
    pointer-events: none;
    position: relative;
`

const InnerWrap = styled.div`
    max-height: 100%;
    overflow: visible;
`

const Pad = styled.div`
    padding-top: 40px;
    padding-bottom: 40px;
    padding-top: 64px;
    padding-bottom: 64px;
`

const Interactive = styled.div`
    max-width: 90vw;
    min-width: 12rem;
    pointer-events: auto;
    width: max-content;
`

const Wigglable = styled.div`
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    min-height: 160px;
`

export const Footer = styled.div<{ $borderless?: boolean; $spacious?: boolean }>`
    align-items: center;
    display: flex;
    height: 80px;
    padding: 0 40px;
    width: 100%;

    ${({ $borderless = false }) =>
        !$borderless &&
        css`
            border-top: 1px solid #f3f3f3;
        `}

    ${({ $spacious = false }) =>
        $spacious &&
        css`
            @media ${TABLET} {
                height: 120px;
            }
        `}
`
