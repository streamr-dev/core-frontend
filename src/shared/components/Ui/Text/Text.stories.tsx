import React from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Text from './index'

export const Native = () => <input />

Native.story = {
    name: 'native',
}

export const NoEvents = () => <Text />

NoEvents.story = {
    name: 'no events',
}

export const Default = () => (
    <Text
        smartCommit={false}
        onChange={action('onChange')}
        onCommit={action('onCommit')}
        noEmptyCommit={false}
        revertOnEscape={false}
    />
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/Text',
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
