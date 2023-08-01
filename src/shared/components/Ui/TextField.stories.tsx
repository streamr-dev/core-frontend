import React from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import TextField from './TextField'

export const Native = () => <input />

Native.story = {
    name: 'native',
}

export const NoEvents = () => <TextField commitSame />

NoEvents.story = {
    name: 'no events',
}

export const Default = () => (
    <TextField
        commitSame
        onChange={action('onChange')}
        onCommit={action('onCommit')}
        revertOnEscape
        flushHistoryOnBlur
        selectAllOnFocus
    />
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/TextField',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        background: 'white',
                        color: '#323232',
                        margin: '3rem',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
