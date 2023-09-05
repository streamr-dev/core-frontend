import React, { ReactNode, useEffect, useReducer, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'

interface Props {
    icon?: ReactNode
    value?: string
    valuePlaceholder?: string
    children?: (close: () => void) => ReactNode
}

export default function DetailDropdown({
    children,
    icon,
    value: valueProp = '',
    valuePlaceholder = '',
}: Props) {
    const value = valueProp || valuePlaceholder

    const [open, setOpen] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) {
            return () => {}
        }

        function onMouseDown(e: MouseEvent) {
            if (!(e.target instanceof Element)) {
                return
            }

            if (rootRef.current?.contains(e.target) === true) {
                return
            }

            setOpen(false)
        }

        window.addEventListener('mousedown', onMouseDown)

        function onKeyDown({ key }) {
            if (
                key === 'Escape' &&
                rootRef.current?.contains(document.activeElement) === true
            ) {
                /**
                 * We only make the Escape key dismiss the dropdown if the
                 * active (focused) element is within `root`.
                 */
                setOpen(false)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('mousedown', onMouseDown)

            window.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    return (
        <Root ref={rootRef}>
            <Toggle type="button" onClick={() => void setOpen((c) => !c)} $active={open}>
                <IconWrap>{icon}</IconWrap>
                {value && <Value $unset={!valueProp}>{value}</Value>}
            </Toggle>
            {children && open && <Popover>{children(() => void setOpen(false))}</Popover>}
        </Root>
    )
}

const Root = styled.div`
    height: 32px;
    position: relative;
`

const Toggle = styled.button<{ $active?: boolean }>`
    align-items: center;
    appearance: none;
    background-color: #ffffff;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15);
    display: flex;
    border: 0;
    border-radius: 4px;
    height: 32px;
    max-width: 100%;
    min-width: 32px;
    outline: 0;
    padding: 0 8px;
    transition: 0.5s background-color;

    :hover {
        background-color: ${COLORS.secondaryLight};
        transition-duration: 0.1s;
    }

    ${({ $active = false }) =>
        $active &&
        css`
            background-color: ${COLORS.secondaryLight};
        `}
`

const Popover = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.03);
    margin-top: 8px;
    min-width: 320px;
    position: absolute;
    top: 100%;
`

const IconWrap = styled.div`
    flex-shrink: 0;
    height: 16px;
    width: 16px;

    > svg {
        display: block;
        height: 100%;
        width: 100%;
    }

    :empty {
        background: currentColor;
        border-radius: 50%;
    }
`

const Value = styled.div<{ $unset?: boolean }>`
    color: ${({ $unset = false }) => ($unset ? '#a3a3a3' : void 0)};
    font-size: 14px;
    line-height: normal;
    margin-left: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const List = styled.ul`
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(
        ${({ children }) => React.Children.count(children)},
        auto
    );
    justify-content: start;
    list-style: none;
    margin: 0;
    padding: 0;

    > li {
        min-width: 0;
    }
`

export const DetailIcon = styled(SvgIcon)<{ $color?: string }>`
    color: ${({ $color = 'currentColor' }) => $color};
    transition: 350ms color;
`
