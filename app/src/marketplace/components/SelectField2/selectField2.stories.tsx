import React, { useState, useMemo } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import SelectField2 from '.'
const stories = storiesOf('Marketplace/SelectField2', module)
    .addDecorator(
        styles({
            padding: '5rem',
        }),
    )

const options = [
    {
        label: 'Business',
        value: 'business',
    },
    {
        label: 'Entertainment',
        value: 'entertainment',
    },
    {
        label: 'IoT',
        value: 'iot',
    },
]
type SetPriceControllerProps = {
    disabled?: boolean,
    value?: string
}

const SelectFieldController = ({ disabled, value: val }: SetPriceControllerProps) => {
    const [value, setValue] = useState(val)
    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === value)?.value, [value])
    return (
        <SelectField2
            placeholder="Select category"
            options={options}
            value={selectedValue}
            onChange={(nextValue) => {
                setValue(nextValue)
                action('dropdownChange')(nextValue)
            }}
            disabled={disabled}
        />
    )
}

stories.add('basic', () => <SelectFieldController />)
stories.add('with preselected value', () => <SelectFieldController value={'entertainment'} />)
stories.add('disabled', () => <SelectFieldController disabled={true} value={'entertainment'} />)
