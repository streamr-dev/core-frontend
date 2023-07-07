import React from 'react'
import { Meta } from '@storybook/react'
import { BlackTooltip } from './Tooltip'

export const Click = () => (
    <div>
        <span data-tooltip-id="click-tooltip">Click for tooltip</span>
        <BlackTooltip id="click-tooltip" openOnClick={true}>
            I am a tooltip
        </BlackTooltip>
    </div>
)

const meta: Meta<typeof Click> = {
    title: 'Shared/Tooltip',
    component: Click,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '16px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const Hover = () => (
    <div>
        <span data-tooltip-id="hover-tooltip">Hover for a tooltip</span>
        <BlackTooltip id="hover-tooltip" openOnClick={false}>
            I am a tooltip too!
        </BlackTooltip>
    </div>
)
