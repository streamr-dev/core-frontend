// @flow

import React, { type Node, type ComponentType } from 'react'
import cx from 'classnames'

import Spinner from '$shared/components/Spinner'

import styles from './newButton.pcss'

export type Size = 'mini' | 'normal' | 'big'
export type Kind = 'primary' | 'secondary' | 'destructive' | 'link' | 'special'
export type Variant = 'dark'

type Props = {
    className?: string,
    tag: string | ComponentType<any>,
    size?: Size,
    kind?: Kind,
    variant?: Variant,
    outline?: boolean,
    disabled?: boolean,
    waiting?: boolean,
    onClick?: (e: SyntheticInputEvent<EventTarget>) => void | Promise<void>,
    children?: Node,
    external?: boolean,
    href?: string,
}

const Button = ({
    className,
    tag: Tag,
    size,
    kind,
    variant,
    outline,
    disabled,
    waiting,
    onClick,
    children,
    external,
    ...args
}: Props) => (
    <Tag
        {...args}
        className={
            cx(styles.root, {
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
            }, className)
        }
        onClick={onClick}
        disabled={disabled || waiting}
        tabIndex={disabled ? -1 : 0}
    >
        {children}
        {waiting && (
            <Spinner color="white" containerClassname={styles.spinnerContainer} />
        )}
    </Tag>
)

Button.defaultProps = {
    tag: 'button',
    kind: 'primary',
    size: 'normal',
    outline: false,
    disabled: false,
    waiting: false,
}

export default Button
