// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import DaysPopover from '$shared/components/DaysPopover'
import ProductStat from '$shared/components/ProductStat'
import TimeSeriesGraph from '.'

const stories =
    storiesOf('Shared/TimeSeriesGraph', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const MSEC_DAILY = 86400000

const today = new Date('2035-01-01').getTime() + Math.floor(MSEC_DAILY / 2)

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

const WithShownDays = ({ data }) => {
    const [days, setDays] = useState(7)

    return (
        <div>
            <TimeSeriesGraph.Header>
                <ProductStat.Title>
                    Title
                </ProductStat.Title>
                <DaysPopover
                    onChange={setDays}
                    selectedItem={`${days}`}
                />
            </TimeSeriesGraph.Header>
            <TimeSeriesGraph graphData={data} shownDays={days} />
        </div>
    )
}

stories.add('with shown days', () => (
    <WithShownDays data={graphData} />
))

const graphDataLarge = [{
    x: today,
    y: 1300,
}, {
    x: today + MSEC_DAILY,
    y: 1500,
}, {
    x: today + (MSEC_DAILY * 2),
    y: 4200,
}, {
    x: today + (MSEC_DAILY * 3),
    y: 3800,
}, {
    x: today + (MSEC_DAILY * 4),
    y: 4400,
}, {
    x: today + (MSEC_DAILY * 5),
    y: 5800,
}, {
    x: today + (MSEC_DAILY * 6),
    y: 13400,
}]

stories.add('large values', () => (
    <WithShownDays data={graphDataLarge} />
))
