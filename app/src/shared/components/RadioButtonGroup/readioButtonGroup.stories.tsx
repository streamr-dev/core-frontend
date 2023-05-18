import React from 'react'
import {Meta} from "@storybook/react"
import { action } from '@storybook/addon-actions'
import RadioButtonGroup from '.'

export const Default = () => (
    <RadioButtonGroup
        name="group"
        options={['value 1', 'value 2', 'value 3']}
        selectedOption="value 2"
        onChange={action('selected')}
    />
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/RadioButtonGroup',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '2rem',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

export const Disabled = () => (
    <RadioButtonGroup
        name="group"
        options={['value 1', 'value 2', 'value 3']}
        selectedOption="value 2"
        onChange={action('selected')}
        disabled
    />
)

Disabled.story = {
    name: 'disabled',
}
