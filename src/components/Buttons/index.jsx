// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'

export type ButtonAction = {
    title: string,
    onClick?: () => void,
    linkTo?: string,
    color?: string,
    disabled?: boolean,
    visible?: boolean,
    outline?: boolean,
}

export type ButtonActions = {
    [string]: ButtonAction,
}

export type Props = {
    actions?: ButtonActions,
    className?: string,
}

export const Buttons = ({ actions, className }: Props) => (
    <div className={className}>
        {actions && Object.keys(actions).filter((key: string) => actions && actions[key].visible !== false).map((key: string) => {
            const {
                title,
                onClick,
                linkTo,
                color,
                disabled,
                outline,
            } = (actions && actions[key]) || {}

            return linkTo ? (
                <Button key={key} tag={Link} to={linkTo} onClick={onClick} disabled={disabled} color={color} outline={outline}>{title}</Button>
            ) : (
                <Button key={key} disabled={disabled} onClick={onClick} color={color} outline={outline}>{title}</Button>
            )
        })}
    </div>
)

Buttons.defaultProps = {
    actions: {},
}

export default Buttons
