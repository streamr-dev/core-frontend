import React from 'react'
import { Meta } from '@storybook/react'
import ProductStat from '.'

const stats = [
    {
        id: 'revenue',
        unit: 'DATA',
        value: '123',
    },
    {
        id: 'members',
        value: '500',
    },
    {
        id: 'averageRevenue',
        unit: 'DATA',
        value: '5.12',
    },
    {
        id: 'subscribers',
        value: '34500',
    },
    {
        id: 'revenueShare',
        unit: '%',
        value: '40',
    },
    {
        id: 'created',
        value: '08/10/2019',
    },
]

export const Header = () => (
    <div>
        <ProductStat.Title>header</ProductStat.Title>
        <div>content</div>
    </div>
)

Header.story = {
    name: 'header',
}

const meta: Meta<typeof Header> = {
    title: 'Shared/Stat',
    component: Header,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '1rem',
                        background: '#F8F8F8',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const Value = () => <ProductStat {...stats[0]} title="Revenue" />

Value.story = {
    name: 'value',
}

export const Values = () => <ProductStat.List items={stats} />

Values.story = {
    name: 'values',
}

export const Mobile = () => <ProductStat.List items={stats} />

Mobile.story = {
    name: 'mobile',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const Tablet = () => <ProductStat.List items={stats} />

Tablet.story = {
    name: 'tablet',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const Loading = () => (
    <ProductStat.List items={stats.map((stat) => ({ ...stat, loading: true }))} />
)

Loading.story = {
    name: 'loading',
}
