// @flow

import React, { useState, useMemo } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
// import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import SelectField from '.'

const stories =
    storiesOf('Marketplace/SelectField', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const options = [{
    label: 'First',
    value: 1,
}, {
    label: 'Second',
    value: 2,
}, {
    label: 'Third',
    value: 3,
}]

type SetPriceControllerProps = {
    error?: string
}

const SelectFieldController = ({ error }: SetPriceControllerProps) => {
    const [value, setValue] = useState()

    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === value), [value])

    return (
        <SelectField
            placeholder="Select"
            options={options}
            value={selectedValue}
            onChange={({ value: nextValue }) => setValue(nextValue)}
            error={error}
        />
    )
}

stories.add('basic', () => (
    <SelectFieldController />
))

stories.add('with error', () => (
    <SelectFieldController
        error="Something went wrong"
    />
))
