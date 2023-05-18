import React from 'react'
import {Meta} from "@storybook/react"
import DonutChart from '.'
const data = [
    {
        title: '1',
        value: 50,
        color: 'red',
    },
    {
        title: '2',
        value: 25,
        color: 'blue',
    },
    {
        title: '3',
        value: 25,
        color: 'green',
    },
]

export const Default = () => (
    <div
        style={{
            width: '300px',
        }}
    >
        <DonutChart strokeWidth={5} data={data} />
    </div>
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/DonutChart',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

export const Disabled = () => (
    <div
        style={{
            width: '300px',
        }}
    >
        <DonutChart strokeWidth={5} data={data} disabled />
    </div>
)

Disabled.story = {
    name: 'disabled',
}
