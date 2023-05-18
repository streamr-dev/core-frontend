import React from 'react'
import {Meta} from "@storybook/react"
import ProgressBar from '.'

export const Default = () => {
    const value = 25
    return <ProgressBar value={value} />
}

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/ProgressBar',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '2rem',
        }}>
            <Story/>
        </div>
    }]
}

export default meta
