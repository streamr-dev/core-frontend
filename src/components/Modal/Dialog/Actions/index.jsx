// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'

export type DialogAction = {
    title: string,
    onClick: () => void,
    color?: string,
}

export type Props = {
    actions?: {
        [string]: DialogAction,
    },
}

export const Actions = ({ actions }: Props) => (
    <div>
        {actions && Object.keys(actions).map((key: string) => {
            const { title, onClick } = actions && actions[key] || {}

            return (
                <Button key={key} onClick={onClick}>{title}</Button>
            )
        })}
    </div>
)

Actions.defaultProps = {
    actions: {}
}

export default Actions
