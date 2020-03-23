// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import Header from './Header'
import Value from './Value'
import Values from './Values'

const stories =
    storiesOf('Shared/DataUnionStats', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '1rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const stats = [{
    id: 'revenue',
    label: 'Total product revenue',
    unit: 'DATA',
    value: '123',
}, {
    id: 'members',
    label: 'Active Members',
    value: '500',
}, {
    id: 'averageRevenue',
    label: 'Avg rev member / month',
    unit: 'DATA',
    value: '5.12',
}, {
    id: 'subscribers',
    label: 'Subscribers',
    value: '34500',
}, {
    id: 'adminFee',
    label: 'Admin Fee',
    unit: '%',
    value: '40',
}, {
    id: 'created',
    label: 'Product created',
    value: '08/10/2019',
}]

stories.add('header', () => (
    <div>
        <Header>header</Header>
        <div>content</div>
    </div>
))

stories.add('value', () => (
    <Value {...stats[0]} />
))

stories.add('values', () => (
    <Values stats={stats} />
))

stories.add('mobile', () => (
    <Values stats={stats} />
), {
    viewport: {
        defaultViewport: 'sm',
    },
})

stories.add('tablet', () => (
    <Values stats={stats} />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('loading', () => (
    <Values stats={stats.map((stat) => ({
        ...stat,
        loading: true,
    }))}
    />
))
