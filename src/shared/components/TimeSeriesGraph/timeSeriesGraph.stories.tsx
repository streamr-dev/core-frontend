import React from 'react'
import { Meta } from '@storybook/react'
import { format } from 'date-fns'
import { TimeSeriesGraph } from './index'

const MSEC_DAILY = 86400000
const today = new Date().getTime() + Math.floor(MSEC_DAILY * 0.5)
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
export const Default = () => (
    <TimeSeriesGraph
        graphData={graphData}
        xAxisDisplayFormatter={(value) => format(new Date(value), 'dd MMM')}
        tooltipLabelFormatter={(value) => format(new Date(value), 'dd/mm/yyyy')}
        tooltipValuePrefix="Msg/s"
    />
)

const meta: Meta<typeof Default> = {
    title: 'Shared/TimeSeriesGraph',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '10px',
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
    <TimeSeriesGraph graphData={graphData} isLoading tooltipValuePrefix={'Msg/s'} />
)

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
    <TimeSeriesGraph
        graphData={graphDataLarge}
        tooltipValuePrefix={'Amount staked'}
        yAxisAxisDisplayFormatter={(value) => Math.round(value / 1000000) + 'M'}
        xAxisDisplayFormatter={(value) => format(new Date(value), 'dd MMM')}
        tooltipLabelFormatter={(value) => format(new Date(value), 'dd/mm/yyyy')}
        tooltipValueFormatter={(value) => Math.round(value / 1000000) + 'M DATA'}
    />
)

export const LargeAmountOfData = () => {
    const data = new Array(365).fill(null).map((_, index) => {
        return {
            x: today + MSEC_DAILY * index,
            // y: Math.round(10000000 * Math.random()),
            y: 10000000 * ((index + 1) / 365) * Math.random(),
        }
    })
    return (
        <TimeSeriesGraph
            graphData={data}
            tooltipValuePrefix={'Amount staked'}
            yAxisAxisDisplayFormatter={(value) => Math.round(value / 1000000) + 'M'}
            xAxisDisplayFormatter={(value) => format(new Date(value), 'dd MMM')}
            tooltipLabelFormatter={(value) => format(new Date(value), 'dd/mm/yyyy')}
            tooltipValueFormatter={(value) => Math.round(value / 1000000) + 'M DATA'}
        />
    )
}
