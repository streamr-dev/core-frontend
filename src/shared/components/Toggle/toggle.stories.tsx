import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Toggle } from '~/shared/components/Toggle'

const ToggleContainer = () => {
    const [value, setValue] = useState(true)
    return (
        <Toggle
            id="toggle1"
            value={value}
            onChange={(value) => {
                setValue(value)
                action('checked')(value)
            }}
        />
    )
}

export const Changeable = () => <ToggleContainer />

const meta: Meta<typeof Changeable> = {
    title: 'Shared/Toggle',
    component: Changeable,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '15px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}
export default meta
