import { ReactElement, ReactNode } from 'react'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { Dropdown as RsDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { DropdownMenuProps } from 'reactstrap/lib/DropdownMenu'
import { DropdownToggleProps } from 'reactstrap/lib/DropdownToggle'
import cx from 'classnames'
import SvgIcon from '~/shared/components/SvgIcon'
import Meatball from '~/shared/components/Meatball'

type Props = {
    title: ReactNode
    type?:
        | 'normal'
        | 'uppercase'
        | 'meatball'
        | 'grayMeatball'
        | 'whiteMeatball'
        | 'verticalMeatball'
    children?: ReactNode | ReactNode[]
    className?: string
    caret?: false | 'arrow' | 'svg'
    activeTitle?: boolean
    selectedItem?: string | null | undefined
    toggleProps?: DropdownToggleProps
    menuProps?: DropdownMenuProps & {
        modifiers?: Record<string, any>
    }
    onMenuToggle?: (arg0: boolean) => any
    direction?: 'up' | 'down' | 'left' | 'right'
    disabled?: boolean
    onChange?: (arg0: string) => void
    leftTick?: boolean
    openOnHover?: boolean
}
const UppercaseTitle = styled.span`
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2px;
    line-height: 24px;
    text-transform: uppercase;
`
export const StyledDropdown = styled(RsDropdown)<RsDropdown['props']>`
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
                color: #adadad;
            }

            &:focus {
                outline: none;
                box-shadow: inset 0 0 0 1.5px var(--focus-border-color);
            }

            &.dropdown-item:active,
            &.dropdown-item.active {
                background-color: #f7f7f9;
                color: var(--greyDark);
            }
        }
    }
`
export const StyledDropdownToggle = styled(DropdownToggle)`
    && {
        color: #a3a3a3;
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
    &.nav-dropdown {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
            0 5px 15px rgba(0, 0, 0, 0.1);
        border: none;
        border-radius: 8px;
        padding: 16px 0;
        margin: 0;
        overflow: hidden;
        .dropdown-item {
            padding: 16px 32px !important;
        }
    }
`
const TextCaret = styled.span`
    margin-left: 0.35em;
    display: inline-block;
    height: 9px;
    line-height: 6px;
    transition: transform 180ms ease-in-out;

    &.open {
        transform: rotate(180deg);
    }
`
const SvgCaret = styled(SvgIcon)`
    width: 11px;
    margin-left: 0.5em;
    transition: transform 180ms ease-in-out;

    &.open {
        transform: rotate(180deg);
    }
`
type CaretProps = {
    open?: boolean
    svg?: boolean
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
    type = 'normal',
    onMenuToggle,
    children,
    className,
    caret = 'arrow',
    activeTitle,
    selectedItem,
    toggleProps: { className: toggleClassName, ...toggleProps } = {},
    menuProps: { className: menuClassName, ...menuProps } = {},
    direction,
    disabled,
    onChange,
    leftTick,
    openOnHover = false,
}: Props) => {
    const [open, setOpen] = useState(false)
    const childrenArray = useMemo<ReactElement[]>(
        () => React.Children.toArray(children) as ReactElement[],
        [children],
    )
    const selectedIndex = useMemo(
        () => childrenArray.findIndex((child) => child.props.value === selectedItem),
        [childrenArray, selectedItem],
    )
    const currentItem = useMemo(
        () => (selectedIndex >= 0 && childrenArray[selectedIndex].props.children) || null,
        [selectedIndex, childrenArray],
    )
    const titleString = useMemo(() => {
        if (!activeTitle || !currentItem) {
            return title
        }

        return currentItem
    }, [activeTitle, title, currentItem])
    const titleComponent = useMemo(() => {
        switch (type) {
            case 'uppercase':
                return <UppercaseTitle>{titleString}</UppercaseTitle>

            case 'meatball':
            case 'whiteMeatball':
            case 'verticalMeatball':
            case 'grayMeatball': {
                const meatballProps = {
                    alt: typeof titleString === 'string' ? titleString : '',
                    gray: type === 'grayMeatball',
                    white: type === 'whiteMeatball',
                    vertical: type === 'verticalMeatball',
                    disabled,
                }
                return <Meatball {...meatballProps} />
            }

            default:
                return titleString
        }
    }, [titleString, type, disabled])
    const caretComponent = useMemo(() => {
        if (!caret) {
            return null
        }

        return <Caret open={open} svg={caret === 'svg'} />
    }, [caret, open])
    const onClick = useCallback((e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
    }, [])
    const toggle = useCallback(() => {
        setOpen((wasOpen) => !wasOpen)
    }, [])
    const getOnItemClick = useCallback(
        (index: number, originalHandler?: (...args: Array<any>) => any) =>
            (event: React.SyntheticEvent<EventTarget>) => {
                event.preventDefault()

                if (originalHandler && typeof originalHandler === 'function') {
                    originalHandler()
                }

                if (onChange && childrenArray[index]) {
                    const { value } = childrenArray[index].props || {}
                    onChange(value)
                }
            },
        [onChange, childrenArray],
    )
    const onMenuToggleRef = useRef(onMenuToggle)
    useEffect(() => {
        onMenuToggleRef.current = onMenuToggle
    }, [onMenuToggle])
    useEffect(() => {
        if (typeof onMenuToggleRef.current === 'function') {
            onMenuToggleRef.current(open)
        }
    }, [onMenuToggle, open])

    const additionalProps = openOnHover
        ? {
              onMouseOver: () => {
                  setOpen(true)
              },
              onMouseLeave: () => {
                  setOpen(false)
              },
          }
        : {}
    return (
        <StyledDropdown
            toggle={!openOnHover ? toggle : () => {}}
            isOpen={open}
            onClick={onClick}
            direction={direction}
            className={className}
            {...additionalProps}
        >
            <StyledDropdownToggle
                {...toggleProps}
                tag="div"
                className={toggleClassName}
                disabled={!!disabled}
            >
                <ToggleLabel>{titleComponent}</ToggleLabel>
                {caretComponent}
            </StyledDropdownToggle>
            {childrenArray.length > 0 && (
                <StyledDropdownMenu
                    {...menuProps}
                    className={menuClassName}
                    container="body"
                >
                    {React.Children.map(
                        children as ReactElement[],
                        (child, index) =>
                            child &&
                            React.cloneElement(child, {
                                active:
                                    !!child.props.value &&
                                    child.props.value === selectedItem,
                                onClick: getOnItemClick(index, child.props.onClick),
                                leftTick: !!leftTick,
                            }),
                    )}
                </StyledDropdownMenu>
            )}
        </StyledDropdown>
    )
}

Popover.defaultProps = {
    toggleProps: {},
    menuProps: {},
    type: 'normal',
}
export default Popover
