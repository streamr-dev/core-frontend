import React, { useState, useMemo } from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { SelectField2 } from './index'

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
    disabled?: boolean
    value?: string
}

const SelectFieldController = ({ disabled, value: val }: SetPriceControllerProps) => {
    const [value, setValue] = useState(val || null)
    const selectedValue = useMemo(
        () => options.find(({ value: optionValue }) => optionValue === value)?.value,
        [value],
    )
    return (
        <>
            <div style={{ marginBottom: '30px' }}>
                <p>Default:</p>
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
            </div>
            <div>
                <p>White variant:</p>
                <SelectField2
                    placeholder={'Select something'}
                    whiteVariant={true}
                    options={options}
                    value={selectedValue}
                    isClearable={false}
                    onChange={(nextValue) => {
                        setValue(nextValue)
                        action('dropdownChange')(nextValue)
                    }}
                />
            </div>
        </>
    )
}

export const Basic = () => <SelectFieldController />

const meta: Meta<typeof Basic> = {
    title: 'Marketplace/SelectField2',
    component: Basic,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '5rem',
                        backgroundColor: 'ghostwhite',
                        color: 'black',
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

export const WithPreselectedValue = () => (
    <SelectFieldController value={'entertainment'} />
)

WithPreselectedValue.story = {
    name: 'with preselected value',
}

export const Disabled = () => (
    <SelectFieldController disabled={true} value={'entertainment'} />
)

Disabled.story = {
    name: 'disabled',
}
