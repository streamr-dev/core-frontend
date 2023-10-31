import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { COLORS } from '~/shared/utils/styled'

type ChildrenFormatter =
    | ReactNode
    | ((
          toggle: (value: boolean | ((prev: boolean) => boolean)) => void,
          isOpen: boolean,
      ) => ReactNode)

export function SimpleDropdown({
    children,
    menu,
    menuWrapComponent: MenuWrap = SimpleDropdownMenu,
}: {
    menuWrapComponent?: typeof SimpleDropdownMenu
    children?: ChildrenFormatter
    menu?: ChildrenFormatter
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

    return (
        <SimpleDropdownRoot ref={rootRef} data-simple-dropdown>
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
    position: absolute;
    transform: translateY(-8px);
    transition: 250ms;
    transition-delay: 250ms, 0s, 0s;
    transition-property: visibility, opacity, transform;
    visibility: hidden;
    z-index: 1000;

    ${({ $visible = false }) =>
        $visible &&
        css`
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
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
    width: 460px;
`
