import { ComponentType, FunctionComponent, ReactNode } from 'react'
import React, { HTMLProps } from 'react'
import cx from 'classnames'
import { LinkProps } from 'react-router-dom'
import { Optional } from 'utility-types'
import Spinner from '$shared/components/Spinner'
import styles from './newButton.pcss'
export type Size = 'mini' | 'normal' | 'big'
export type Kind = 'primary' | 'secondary' | 'destructive' | 'link' | 'special' | 'primary2' | 'transparent'
export type Variant = 'dark' | 'light'
// TODO - try to make it more generic without passing LinkProps directly
type ButtonProps = Omit<HTMLProps<HTMLButtonElement | HTMLAnchorElement> & Optional<LinkProps>, 'size'> & {
    className?: string
    tag?: string | ComponentType<any>
    size?: Size
    kind?: Kind
    variant?: Variant
    outline?: boolean
    disabled?: boolean
    waiting?: boolean
    onClick?: (e: React.SyntheticEvent<EventTarget>) => void | Promise<any>
    children?: ReactNode
    external?: boolean
    href?: string
    type?: string
}
const darkBgs = new Set(['primary', 'destructive'])

const handleClick = (e: React.SyntheticEvent<EventTarget>, onClick: ButtonProps["onClick"] ) => {
    if (e.currentTarget instanceof HTMLElement) {
        // Make sure we make the button lose focus after click
        e.currentTarget.blur()
    }
    if (onClick != null) {
        onClick(e)
    }
}

const Button: FunctionComponent<ButtonProps> = ({
    className,
    tag: Tag = 'button',
    size= 'normal',
    kind = 'primary',
    variant,
    outline = false,
    disabled= false,
    waiting= false,
    onClick,
    children,
    external,
    ...args
}) => (
    <Tag
        {...args}
        className={cx(
            styles.root,
            {
                [styles.primary]: kind === 'primary',
                [styles.secondary]: kind === 'secondary',
                [styles.destructive]: kind === 'destructive',
                [styles.link]: kind === 'link',
                [styles.special]: kind === 'special',
                [styles.mini]: size === 'mini',
                [styles.normal]: size === 'normal',
                [styles.big]: size === 'big',
                [styles.dark]: variant === 'dark',
                [styles.outline]: outline,
                [styles.primary2]: kind === 'primary2',
                [styles.transparent]: kind === 'transparent'
            },
            className,
        )}
        onClick={disabled ? (e: Event) => e.preventDefault() : (e: React.SyntheticEvent<EventTarget, Event>) => handleClick(e, onClick)}
        disabled={disabled || waiting}
        tabIndex={disabled ? -1 : 0}
    >
        {children}
        {waiting && (
            <Spinner
                color={!outline && darkBgs.has(kind) ? 'white' : 'gray'}
                containerClassname={styles.spinnerContainer}
            />
        )}
    </Tag>
)

export default Button
