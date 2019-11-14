// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import CommunityStats from '.'

const stories =
    storiesOf('Marketplace/CommunityStats', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
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

stories.add('basic', () => (
    <CommunityStats stats={stats} />
))

stories.add('loading', () => (
    <CommunityStats stats={stats.map((stat) => ({
        ...stat,
        loading: true,
    }))}
    />
))
