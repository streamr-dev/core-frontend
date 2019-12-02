// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import WithShownDays from './WithShownDays'
import TimeSeriesGraph from '.'

const stories =
    storiesOf('Shared/TimeSeriesGraph', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const today = new Date().getTime()

const MSEC_DAILY = 86400000

const graphData = [{
    x: today,
    y: 13,
}, {
    x: today + MSEC_DAILY,
    y: 15,
}, {
    x: today + (MSEC_DAILY * 2),
    y: 42,
}, {
    x: today + (MSEC_DAILY * 3),
    y: 38,
}, {
    x: today + (MSEC_DAILY * 4),
    y: 44,
}, {
    x: today + (MSEC_DAILY * 5),
    y: 22,
}, {
    x: today + (MSEC_DAILY * 6),
    y: 32,
}]

stories.add('default', () => (
    <TimeSeriesGraph graphData={graphData} shownDays={7} />
))

stories.add('custom width & height', () => (
    <TimeSeriesGraph
        graphData={graphData}
        shownDays={7}
        width={700}
        height={350}
    />
))

stories.add('with shown days', () => (
    <WithShownDays
        label="Graph"
        onDaysChange={action('onDaysChange')}
    >
        {({ shownDays }) => (
            <TimeSeriesGraph graphData={graphData} shownDays={shownDays} />
        )}
    </WithShownDays>
))

stories.add('with shown days (disabled)', () => (
    <WithShownDays
        label="Graph"
        onDaysChange={action('onDaysChange')}
        disabled
    >
        {({ shownDays }) => (
            <TimeSeriesGraph graphData={graphData} shownDays={shownDays} />
        )}
    </WithShownDays>
))
