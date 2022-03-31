// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Button, { type Kind } from '$shared/components/Button'
import styles from './buttons.pcss'

export type ButtonAction = {
    title: string,
    onClick?: () => void | Promise<void>,
    linkTo?: string,
    href?: string,
    kind?: Kind,
    disabled?: boolean,
    visible?: boolean,
    outline?: boolean,
    spinner?: boolean,
    className?: string,
    type?: string,
}

export type ButtonActions = {
    [string]: ButtonAction,
}

export type Props = {
    actions?: ButtonActions,
    className?: string,
}

export const Buttons = ({ actions, className }: Props) => (
    <div className={classNames(styles.buttons, className)}>
        {actions && Object.keys(actions).filter((key: string) => actions && actions[key].visible !== false).map((key: string) => {
            const {
                title,
                onClick,
                linkTo,
                href,
                kind,
                disabled,
                outline,
                spinner,
                className: cn,
                type,
            } = (actions && actions[key]) || {}
            return (
                <Button
                    key={key}
                    // eslint-disable-next-line no-nested-ternary
                    tag={linkTo != null ? Link : (href != null ? 'a' : 'button')}
                    to={linkTo}
                    href={href}
                    onClick={onClick}
                    disabled={disabled}
                    kind={kind}
                    outline={outline}
                    waiting={spinner}
                    type={type}
                    className={classNames(styles[kind], cn)}
                >
                    {title}
                </Button>
            )
        })}
    </div>
)

Buttons.defaultProps = {
    actions: {},
}

export default Buttons
