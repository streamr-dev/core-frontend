import React from 'react'
import { Meta } from '@storybook/react'
import { StatsBox } from './StatsBox'

export const ThreeColumn = () => (
    <StatsBox
        columns={3}
        stats={[
            { label: 'Total stake', value: '200000 DATA' },
            { label: 'Bounties', value: '233' },
            { label: 'Operators', value: '3323' },
            { label: 'APY', value: '12%' },
            { label: 'Cumulative sponsored', value: '12M DATA' },
            { label: 'Population of Sri Lanka', value: '22.16M' },
        ]}
    />
)

export const FourColumn = () => (
    <StatsBox
        columns={4}
        stats={[
            { label: 'Total stake', value: '200000 DATA' },
            { label: 'Bounties', value: '233' },
            { label: 'Operators', value: '3323' },
            { label: 'APY', value: '12%' },
            { label: 'Cumulative sponsored', value: '12M DATA' },
            { label: 'Population of Sri Lanka', value: '22.16M' },
            { label: 'Amount of fries from 1 potato', value: '25' },
            { label: 'Amount of beers in a crate', value: '24' },
        ]}
    />
)

const meta: Meta<typeof ThreeColumn> = {
    title: 'Shared/StatsBox',
    component: ThreeColumn,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '10px',
                        color: '#000',
                        backgroundColor: '#fff',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
