// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean, number } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import SetPrice from '.'

const stories =
    storiesOf('Marketplace/SetPrice', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

type SetPriceControllerProps = {
    error?: string
}

const SetPriceController = ({ error }: SetPriceControllerProps) => {
    const [price, setPrice] = useState('0')
    const [currency, setCurrency] = useState('DATA')
    const [timeUnit, setTimeUnit] = useState('hour')

    return (
        <SetPrice
            disabled={boolean('disabled', false)}
            price={price}
            onPriceChange={setPrice}
            currency={currency}
            onCurrencyChange={setCurrency}
            timeUnit={timeUnit}
            onTimeUnitChange={setTimeUnit}
            dataPerUsd={number('dataPerUsd', 0.5)}
            error={error}
        />
    )
}

stories.add('basic', () => (
    <SetPriceController />
))

stories.add('with error', () => (
    <SetPriceController
        error="Something went wrong"
    />
))
