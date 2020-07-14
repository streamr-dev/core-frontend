// @flow

import React, { type Node, useState, useCallback, useEffect, useMemo } from 'react'
import { Dropdown as RsDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import cx from 'classnames'
import styled from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import Meatball from '$shared/components/Meatball'

import Item from './Item'

type Props = {
    title: Node,
    type: 'normal' | 'uppercase' | 'meatball' | 'grayMeatball' | 'whiteMeatball',
    children: Node,
    className?: string,
    noCaret?: boolean,
    activeTitle?: boolean,
    selectedItem?: ?string,
    toggleProps: {
        className?: string,
    },
    menuProps: {
        className?: string,
        modifiers?: Object,
    },
    onMenuToggle?: (boolean) => any,
    direction?: string,
    disabled?: boolean,
    onChange?: (string) => void,
}

const UppercaseTitle = styled.span`
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    line-height: 24px;
    text-transform: uppercase;
`

export const StyledDropdown = styled(RsDropdown)`
    .dropdown-menu {
        border: none;
        border-radius: 4px;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        margin: 8px 0 0;
        font-size: 14px;
        min-width: 6rem;
        padding: 4px 0;

        a,
        button {
            padding: 0 16px 0;
            line-height: 28px;

            &,
            &:link {
                color: #323232;
            }

            &[disabled] {
                color: #ADADAD;
            }

            &:focus {
                outline: none;
                box-shadow: inset 0 0 0 1.5px var(--focus-border-color);
            }

            &.dropdown-item:active,
            &.dropdown-item.active {
                background-color: #F7F7F9;
                color: var(--greyDark);
            }
        }
    }
`

export const StyledDropdownToggle = styled(DropdownToggle)`
    && {
        color: #A3A3A3;
        outline: 0;
        text-decoration: none;
        cursor: pointer;
        line-height: 32px;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        &[disabled] {
            opacity: 0.5;
        }

        &:not([disabled]):hover,
        &:not([disabled]):focus {
            color: var(--greyDark) !important;
            background: inherit;
        }
    }
`

export const ToggleLabel = styled.span`
    flex: 1;
`

export const StyledDropdownMenu = styled(DropdownMenu)`
    min-width: 8rem;
`

const TextCaret = styled.span`
    margin-left: 0.35em;
    display: inline-block;
    height: 9px;
    line-height: 6px;

    &.open {
        transform: rotate(180deg);
    }
`

const SvgCaret = styled(SvgIcon)`
    width: 11px;
    margin-left: 0.5em;

    &.open {
        transform: rotate(180deg);
    }
`

type CaretProps = {
    open?: boolean,
    svg?: boolean,
}

export const Caret = ({ open, svg }: CaretProps) => {
    if (svg) {
        return (
            <SvgCaret
                className={cx('caret', {
                    open: !!open,
                })}
                name="caretDown"
            />
        )
    }

    return (
        <TextCaret
            className={cx('caret', {
                open: !!open,
            })}
        >
            &#9662;
        </TextCaret>
    )
}

const Popover = ({
    title,
    type,
    onMenuToggle,
    children,
    className,
    noCaret,
    activeTitle,
    selectedItem,
    toggleProps: { className: toggleClassName, ...toggleProps },
    menuProps: { className: menuClassName, ...menuProps },
    direction,
    disabled,
    onChange,
}: Props) => {
    const [open, setOpen] = useState(false)

    const childrenArray = useMemo(() => React.Children.toArray(children), [children])
    const selectedIndex = useMemo(() => (
        childrenArray.findIndex((child) => child.props.value === selectedItem)
    ), [childrenArray, selectedItem])

    const currentItem = useMemo(() => (
        (selectedIndex >= 0 && childrenArray[selectedIndex].props.children) || null
    ), [selectedIndex, childrenArray])

    const titleString = useMemo(() => {
        if (!activeTitle || !currentItem) {
            return title
        }

        return currentItem
    }, [activeTitle, title, currentItem])

    const titleComponent = useMemo(() => {
        switch (type) {
            case 'uppercase':
                return (
                    <UppercaseTitle>{titleString}</UppercaseTitle>
                )

            case 'meatball':
            case 'whiteMeatball':
            case 'grayMeatball': {
                const meatballProps = {
                    alt: typeof titleString === 'string' ? titleString : '',
                    gray: (type === 'grayMeatball'),
                    white: (type === 'whiteMeatball'),
                    disabled,
                }

                return (
                    <Meatball {...meatballProps} />
                )
            }

            default:
                return titleString
        }
    }, [titleString, type, disabled])

    const caretComponent = useMemo(() => (
        <Caret open={open} svg={type === 'uppercase'} />
    ), [type, open])

    const onClick = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
    }, [])

    const toggle = useCallback(() => {
        setOpen((wasOpen) => !wasOpen)
    }, [])

    const getOnItemClick = useCallback((index: number, originalHandler?: Function) => (event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()

        if (originalHandler && typeof originalHandler === 'function') {
            originalHandler()
        }

        if (onChange && childrenArray[index]) {
            const { value } = childrenArray[index].props || {}
            onChange(value)
        }
    }, [onChange, childrenArray])

    useEffect(() => {
        if (onMenuToggle) {
            onMenuToggle(open)
        }
    }, [onMenuToggle, open])

    return (
        <StyledDropdown
            toggle={toggle}
            isOpen={open}
            onClick={onClick}
            direction={direction}
            className={className}
        >
            <StyledDropdownToggle
                {...toggleProps}
                tag="div"
                className={toggleClassName}
                disabled={!!disabled}
            >
                <ToggleLabel>{titleComponent}</ToggleLabel>
                {!noCaret && caretComponent}
            </StyledDropdownToggle>
            <StyledDropdownMenu
                {...menuProps}
                className={menuClassName}
            >
                {React.Children.map(children, (child, index) => child && React.cloneElement(child, {
                    active: !!child.props.value && child.props.value === selectedItem,
                    onClick: getOnItemClick(index, child.props.onClick),
                }))}
            </StyledDropdownMenu>
        </StyledDropdown>
    )
}

Popover.Item = Item

Popover.defaultProps = {
    toggleProps: {},
    menuProps: {},
    type: 'normal',
}

export default Popover
