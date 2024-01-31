import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import { COLORS } from '~/shared/utils/styled'
import { useBoundingClientRect } from './Anchor'

type ChildrenFormatter =
    | ReactNode
    | ((
          toggle: (value: boolean | ((prev: boolean) => boolean)) => void,
          isOpen: boolean,
      ) => ReactNode)

export function SimpleDropdown({
    children,
    detached = false,
    disabled = false,
    menu,
    menuWrapComponent: MenuWrap = SimpleDropdownMenu,
    onToggle,
    align = 'left',
    ...props
}: {
    children?: ChildrenFormatter
    detached?: boolean
    disabled?: boolean
    menu?: ChildrenFormatter
    menuWrapComponent?: typeof SimpleDropdownMenu
    onToggle?: (value: boolean) => void
    align: 'left' | 'right'
}) {
    const [isOpen, setIsOpen] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)

    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onMouseDown({ target }: MouseEvent) {
            if (!(target instanceof HTMLElement)) {
                return
            }

            if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
                return
            }

            setIsOpen(false)
        }

        document.addEventListener('mousedown', onMouseDown)

        return () => {
            document.removeEventListener('mousedown', onMouseDown)
        }
    }, [])

    const onToggleRef = useRef(onToggle)

    if (onToggleRef.current !== onToggle) {
        onToggleRef.current = onToggle
    }

    useEffect(() => {
        onToggleRef.current?.(isOpen)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                e.stopPropagation()

                e.preventDefault()

                setIsOpen(false)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen])

    useEffect(() => {
        if (disabled) {
            setIsOpen(false)
        }
    }, [disabled])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        function onFocus(e: FocusEvent) {
            if (
                !rootRef.current?.contains(e.target as Element) &&
                !menuRef.current?.contains(e.target as Element)
            ) {
                setIsOpen(false)
            }
        }

        document.body.addEventListener('focus', onFocus, true)

        return () => {
            document.body.removeEventListener('focus', onFocus, true)
        }
    }, [isOpen])

    const posRef = useRef<HTMLDivElement>(null)

    const [x, y] = useBoundingClientRect(posRef, (r) => [
        r?.x || 0,
        (r?.y || 0) + window.scrollY,
    ])

    const [dx, maxWidth] = useBoundingClientRect(menuRef, (rect) => {
        const { clientWidth } = document.documentElement
        const maxWidth = clientWidth - 8

        if (!rect) {
            return [0, maxWidth]
        }

        if (align === 'left') {
            return [Math.min(0, clientWidth - x - Math.round(rect.width) - 4), maxWidth]
        }

        const myWidth = rootRef.current?.clientWidth ?? 0
        return [-Math.round(rect.width) + myWidth - 4, maxWidth]
    })

    return (
        <SimpleDropdownRoot ref={rootRef} {...props}>
            {typeof children === 'function' ? children(setIsOpen, isOpen) : children}
            <div ref={posRef} />
            {detached ? (
                createPortal(
                    <MenuWrap
                        $visible={isOpen}
                        ref={menuRef}
                        style={{
                            transform: `translateX(${dx}px)`,
                            maxWidth,
                            top: `${y}px`,
                            left: `${x}px`,
                        }}
                    >
                        {typeof menu === 'function' ? menu(setIsOpen, isOpen) : menu}
                    </MenuWrap>,
                    document.getElementById('hub-anchors')!,
                )
            ) : (
                <MenuWrap
                    $visible={isOpen}
                    ref={menuRef}
                    style={{
                        transform: `translateX(${dx}px)`,
                        maxWidth,
                    }}
                >
                    {typeof menu === 'function' ? menu(setIsOpen, isOpen) : menu}
                </MenuWrap>
            )}
        </SimpleDropdownRoot>
    )
}

export const SimpleDropdownRoot = styled.div`
    position: relative;
`

export const SimpleDropdownMenu = styled.div<{ $visible?: boolean }>`
    min-height: 16px;
    min-width: 16px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: 250ms;
    transition-delay: 250ms, 0s;
    transition-property: visibility, opacity;
    visibility: hidden;
    z-index: 1000;

    ${({ $visible = false }) =>
        $visible &&
        css`
            opacity: 1;
            pointer-events: auto;
            visibility: visible;
            transition-delay: 0s;
        `}
`

export const SimpleListDropdownMenu = styled.div`
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    color: ${COLORS.primary};
    margin-top: 8px;
    min-height: 16px;
    padding: 8px 0;

    p {
        font-size: 14px;
        line-height: 20px;
        margin: 0;
    }

    p + p {
        margin-top: 8px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`

export const DefaultSimpleDropdownMenu = styled(SimpleListDropdownMenu)`
    padding: 20px 16px;
    max-width: 100%;
    width: 460px;
`
