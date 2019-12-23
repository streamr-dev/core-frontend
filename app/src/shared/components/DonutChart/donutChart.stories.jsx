// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import DonutChart from '.'

const stories =
    storiesOf('Shared/DonutChart', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

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

stories.add('default', () => (
    <div
        style={{
            width: '300px',
        }}
    >
        <DonutChart
            strokeWidth={5}
            data={data}
        />
    </div>
))

stories.add('disabled', () => (
    <div
        style={{
            width: '300px',
        }}
    >
        <DonutChart
            strokeWidth={5}
            data={data}
            disabled
        />
    </div>
))
