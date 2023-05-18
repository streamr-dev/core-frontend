import React from 'react'
import { action } from '@storybook/addon-actions'
import {Meta} from "@storybook/react"
import ConfirmCheckbox from '.'

export const Default = () => (
    <ConfirmCheckbox
        title="Are you sure?"
        subtitle="This is an unrecoverable action"
        onToggle={action('onToggle')}
    />
)

const meta: Meta<typeof Default> = {
    title: 'Shared/ConfirmCheckbox',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '1rem',
            fontSize: '16px',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

Default.story = {
    name: 'default',
}

export const Disabled = () => (
    <ConfirmCheckbox
        title="Are you sure?"
        subtitle="This is an unrecoverable action"
        onToggle={action('onToggle')}
        disabled
    />
)

Disabled.story = {
    name: 'disabled',
}
