import React from 'react'
import { Meta } from '@storybook/react'
import { TimeSeriesGraph } from '.'

const MSEC_DAILY = 86400000
const today = new Date('2035-01-01').getTime() + Math.floor(MSEC_DAILY * 0.5)
const graphData = [
    {
        x: today,
        y: 13,
    },
    {
        x: today + MSEC_DAILY,
        y: 15,
    },
    {
        x: today + MSEC_DAILY * 2,
        y: 42,
    },
    {
        x: today + MSEC_DAILY * 3,
        y: 38,
    },
    {
        x: today + MSEC_DAILY * 4,
        y: 44,
    },
    {
        x: today + MSEC_DAILY * 5,
        y: 22,
    },
    {
        x: today + MSEC_DAILY * 6,
        y: 32,
    },
]
export const Default = () => <TimeSeriesGraph graphData={graphData} shownDays={7} />

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/TimeSeriesGraph',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '5rem',
                        background: '#FFF',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const Loading = () => (
    <TimeSeriesGraph graphData={graphData} shownDays={7} isLoading />
)

Loading.story = {
    name: 'loading',
}

const graphDataLarge = [
    {
        x: today,
        y: 1300000,
    },
    {
        x: today + MSEC_DAILY,
        y: 1500000,
    },
    {
        x: today + MSEC_DAILY * 2,
        y: 4200000,
    },
    {
        x: today + MSEC_DAILY * 3,
        y: 3800000,
    },
    {
        x: today + MSEC_DAILY * 4,
        y: 4400000,
    },
    {
        x: today + MSEC_DAILY * 5,
        y: 5800000,
    },
    {
        x: today + MSEC_DAILY * 6,
        y: 13400000,
    },
    {
        x: today + MSEC_DAILY * 7,
        y: 15400000,
    },
    {
        x: today + MSEC_DAILY * 8,
        y: 17300000,
    },
]
export const LargeValues = () => (
    <TimeSeriesGraph graphData={graphDataLarge} shownDays={7} />
)

LargeValues.story = {
    name: 'large values',
}
