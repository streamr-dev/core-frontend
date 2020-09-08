import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import ProductStat from '.'

const stories =
    storiesOf('Shared/Stat', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '1rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const stats = [{
    id: 'revenue',
    unit: 'DATA',
    value: '123',
}, {
    id: 'members',
    value: '500',
}, {
    id: 'averageRevenue',
    unit: 'DATA',
    value: '5.12',
}, {
    id: 'subscribers',
    value: '34500',
}, {
    id: 'revenueShare',
    unit: '%',
    value: '40',
}, {
    id: 'created',
    value: '08/10/2019',
}]

stories.add('header', () => (
    <div>
        <ProductStat.Title>header</ProductStat.Title>
        <div>content</div>
    </div>
))

stories.add('value', () => (
    <ProductStat {...stats[0]} title="Revenue" />
))

stories.add('values', () => (
    <ProductStat.List items={stats} />
))

stories.add('mobile', () => (
    <ProductStat.List items={stats} />
), {
    viewport: {
        defaultViewport: 'sm',
    },
})

stories.add('tablet', () => (
    <ProductStat.List items={stats} />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('loading', () => (
    <ProductStat.List items={stats.map((stat) => ({
        ...stat,
        loading: true,
    }))}
    />
))
