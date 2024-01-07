import React, { FC, HTMLAttributes, RefObject, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

interface AnchorComponentProps {
    x: number
    y: number
}

interface AnchorProps<T extends AnchorComponentProps = AnchorComponentProps>
    extends Omit<HTMLAttributes<HTMLDivElement>, 'translate'> {
    component: FC<T>
    componentProps: Omit<T, 'x' | 'y'>
    indicateOrigin?: boolean
    inline?: boolean
    translate?: (rect: DOMRect | undefined) => [number, number]
}

/**
 * Mounts given function component inside `#hub-anchors` (see `index.html`) and passes
 * wrapped element's coordinates to it.
 */
export function Anchor<T extends AnchorComponentProps = AnchorComponentProps>({
    indicateOrigin = false,
    translate,
    component: Component,
    componentProps,
    children,
    inline = false,
    ...props
}: AnchorProps<T>) {
    const ref = useRef<HTMLDivElement>(null)

    const [x, y] = useBoundingClientRect(ref, (rect) => translate?.(rect) || [0, 0])

    return (
        <Root {...props} ref={ref} $display={inline ? 'inline' : undefined}>
            {children}
            {createPortal(
                <Component x={x} y={y} {...(componentProps as any)} />,
                document.getElementById('hub-anchors')!,
            )}
            {indicateOrigin &&
                createPortal(
                    <OriginIndicator x={x} y={y} />,
                    document.getElementById('hub-anchors')!,
                )}
        </Root>
    )
}

function resizeSubscribe(cb: () => void) {
    window.addEventListener('resize', cb)

    window.addEventListener('scroll', cb)

    return () => {
        window.removeEventListener('resize', cb)

        window.removeEventListener('scroll', cb)
    }
}

function OriginIndicator({ x, y }: { x: number; y: number }) {
    return (
        <Point
            style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            }}
        />
    )
}

const Point = styled.div`
    background: red;
    border-radius: 50%;
    height: 10px;
    left: 0;
    position: absolute;
    top: 0;
    width: 10px;
    z-index: 19999;
`

export function useBoundingClientRect<T>(
    ref: RefObject<HTMLDivElement>,
    translate: (rect: DOMRect | undefined) => T,
): T {
    return JSON.parse(
        useSyncExternalStore(resizeSubscribe, () =>
            JSON.stringify(translate(ref.current?.getBoundingClientRect())),
        ),
    ) as T
}

const Root = styled.div<{ $display?: 'inline' }>`
    display: ${({ $display }) => $display};
`
