// @flow

import React, { Component, type Node, useState, useCallback, useEffect, useMemo } from 'react'
import { Dropdown as RsDropdown, DropdownItem as RsDropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import cx from 'classnames'
import styled, { css } from 'styled-components'

import SvgIcon from '$shared/components/SvgIcon'
import ActiveTickItem from '../Dropdown/DropdownItem'
import Meatball from '$shared/components/Meatball'

import styles from './dropdownActions.pcss'

type Props = {
    title: Node,
    type: 'normal' | 'uppercase' | 'meatball',
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

const StyledDropdown = styled(RsDropdown)`
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

const StyledDropdownToggle = styled(DropdownToggle)`
    && {
        color: #A3A3A3;
        outline: 0;
        text-decoration: none;
        cursor: pointer;
        line-height: 32px;

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

const StyledDropdownMenu = styled(DropdownMenu)`
    min-width: 8rem;
`

const Caret = styled.span`
    margin-left: 0.35em;
    display: inline-block;

    ${({ open }) => (!!open && css`
        transform: rotate(180deg) translate(0, -1px);
    `)}
`

const SvgCaret = styled(SvgIcon)`
    width: 11px;
    margin-left: 0.5em;
    transform: rotate(${({ open }) => (open ? '180' : '0')}deg);
`

const DropdownActions = ({
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
        if (!activeTitle) {
            return title
        }

        return currentItem
    }, [activeTitle, title, currentItem])

    const titleComponent = useMemo(() => {
        switch (type) {
            case 'uppercase':
                return <UppercaseTitle>{titleString}</UppercaseTitle>

            case 'meatball':
                return <Meatball alt={typeof titleString === 'string' ? titleString : ''} />

            default:
                return titleString
        }
    }, [titleString, type])

    const caretComponent = useMemo(() => {
        switch (type) {
            case 'uppercase':
                return (
                    <SvgCaret className="caret" name="caretDown" open={open} />
                )

            default:
                return (
                    <Caret className="caret" open={open}>&#9662;</Caret>
                )
        }
    }, [type, open])

    const onClick = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
    }, [])

    const toggle = useCallback(() => {
        setOpen((wasOpen) => !wasOpen)
    }, [])

    const getOnItemClick = useCallback((index: number) => (event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()

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
                {titleComponent}
                {!noCaret && caretComponent}
            </StyledDropdownToggle>
            <StyledDropdownMenu
                {...menuProps}
                className={menuClassName}
            >
                {React.Children.map(children, (child, index) => React.cloneElement(child, child.props.value ? {
                    active: child.props.value === selectedItem,
                    onClick: getOnItemClick(index),
                } : {}))}
            </StyledDropdownMenu>
        </StyledDropdown>
    )
}

DropdownActions.Item = RsDropdownItem
DropdownActions.ActiveTickItem = ActiveTickItem

DropdownActions.defaultProps = {
    toggleProps: {},
    menuProps: {},
    type: 'normal',
}

export default DropdownActions
