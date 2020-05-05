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
    kind?: Kind,
    disabled?: boolean,
    visible?: boolean,
    outline?: boolean,
    spinner?: boolean,
    className?: string,
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
                kind,
                disabled,
                outline,
                spinner,
                className: cn,
            } = (actions && actions[key]) || {}
            return (
                <Button
                    key={key}
                    tag={linkTo != null ? Link : 'button'}
                    to={linkTo}
                    onClick={onClick}
                    disabled={disabled}
                    kind={kind}
                    outline={outline}
                    waiting={spinner}
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
