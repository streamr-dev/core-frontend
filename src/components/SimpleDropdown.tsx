import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { COLORS, TABLET } from '~/shared/utils/styled'

type ChildrenFormatter =
    | ReactNode
    | ((
          toggle: (value: boolean | ((prev: boolean) => boolean)) => void,
          isOpen: boolean,
      ) => ReactNode)

export function SimpleDropdown({
    children,
    disabled = false,
    menu,
    menuWrapComponent: MenuWrap = SimpleDropdownMenu,
}: {
    children?: ChildrenFormatter
    disabled?: boolean
    menu?: ChildrenFormatter
    menuWrapComponent?: typeof SimpleDropdownMenu
}) {
    const [isOpen, setIsOpen] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onMouseDown({ target }: MouseEvent) {
            if (!(target instanceof HTMLElement)) {
                return
            }

            if (rootRef.current?.contains(target)) {
                return
            }

            setIsOpen(false)
        }

        document.addEventListener('mousedown', onMouseDown)

        return () => {
            document.removeEventListener('mousedown', onMouseDown)
        }
    }, [])

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
            if (!rootRef.current?.contains(e.target as Element)) {
                setIsOpen(false)
            }
        }

        document.body.addEventListener('focus', onFocus, true)

        return () => {
            document.body.removeEventListener('focus', onFocus, true)
        }
    }, [isOpen])

    return (
        <SimpleDropdownRoot ref={rootRef}>
            {typeof children === 'function' ? children(setIsOpen, isOpen) : children}
            <MenuWrap $visible={isOpen}>
                {typeof menu === 'function' ? menu(setIsOpen, isOpen) : menu}
            </MenuWrap>
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
    position: fixed;
    left: 50%;
    transform: translateY(-8px) translateX(-50%);
    transition: 250ms;
    transition-delay: 250ms, 0s, 0s;
    transition-property: visibility, opacity, transform;
    visibility: hidden;
    z-index: 1000;

    @media ${TABLET} {
        position: absolute;
        left: auto;
        transform: translateY(-8px);
    }

    ${({ $visible = false }) =>
        $visible &&
        css`
            opacity: 1;
            pointer-events: auto;
            left: 50%;
            transform: translateY(0) translateX(-50%);
            visibility: visible;
            transition-delay: 0s;

            @media ${TABLET} {
                position: absolute;
                left: auto;
                transform: translateY(0);
            }
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
    max-width: 100vw;
    width: auto;

    @media ${TABLET} {
        width: 460px;
    }
`
