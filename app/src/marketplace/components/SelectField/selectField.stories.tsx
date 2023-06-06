import React, { useState, useMemo } from 'react'
import { Meta } from '@storybook/react'
import SelectField from '.'

const options = [
    {
        label: 'First',
        value: 1,
    },
    {
        label: 'Second',
        value: 2,
    },
    {
        label: 'Third',
        value: 3,
    },
]
type SetPriceControllerProps = {
    error?: string
    disabled?: boolean
}

const SelectFieldController = ({ error, disabled }: SetPriceControllerProps) => {
    const [value, setValue] = useState()
    const selectedValue = useMemo(
        () => options.find(({ value: optionValue }) => optionValue === value),
        [value],
    )
    return (
        <SelectField
            placeholder="Select"
            options={options}
            value={selectedValue}
            onChange={({ value: nextValue }) => setValue(nextValue)}
            error={error}
            disabled={disabled}
        />
    )
}

export const Basic = () => <SelectFieldController />

const meta: Meta<typeof Basic> = {
    title: 'Marketplace/SelectField',
    component: Basic,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '5rem',
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

Basic.story = {
    name: 'basic',
}

export const Disabled = () => <SelectFieldController disabled />

Disabled.story = {
    name: 'disabled',
}

export const WithError = () => <SelectFieldController error="Something went wrong" />

WithError.story = {
    name: 'with error',
}
