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
}

export type ButtonActions = {
    [string]: ButtonAction,
}

export type Props = {
    actions?: ButtonActions,
}

export const Buttons = ({ actions }: Props) => (
    <div>
        {actions && Object.keys(actions).filter((key: string) => actions && actions[key].visible !== false).map((key: string) => {
            const {
                title,
                onClick,
                linkTo,
                color,
                disabled,
            } = (actions && actions[key]) || {}

            return linkTo ? (
                <Button key={key} tag={Link} to={linkTo} onClick={onClick} disabled={disabled} color={color}>{title}</Button>
            ) : (
                <Button key={key} disabled={disabled} color={color}>{title}</Button>
            )
        })}
    </div>
)

Buttons.defaultProps = {
    actions: {},
}

export default Buttons
