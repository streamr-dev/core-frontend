import React from 'react'
import { Meta } from '@storybook/react'
import { StreamConnect } from '~/shared/components/StreamConnect/index'

export const Default = () => <StreamConnect streams={['0xdjsdgfjkj32k3j423dfsd']} />

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/StreamConnect',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '2rem',
                        color: '#000',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
