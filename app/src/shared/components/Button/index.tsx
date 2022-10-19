import type { ComponentType, FunctionComponent, ReactNode } from 'react'
import React, { HTMLProps } from 'react'
import cx from 'classnames'
import { LinkProps } from 'react-router-dom'
import { Optional } from 'utility-types'
import Spinner from '$shared/components/Spinner'
import styles from './newButton.pcss'
export type Size = 'mini' | 'normal' | 'big'
export type Kind = 'primary' | 'secondary' | 'destructive' | 'link' | 'special'
export type Variant = 'dark' | 'light'
// TODO - try to make it more generic without passing LinkProps directly
type ButtonProps = HTMLProps<HTMLButtonElement | HTMLAnchorElement> & Optional<LinkProps> & {
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
            },
            className,
        )}
        onClick={disabled ? (e: Event) => e.preventDefault() : onClick}
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
