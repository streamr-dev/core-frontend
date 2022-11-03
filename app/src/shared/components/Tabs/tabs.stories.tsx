import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import Tabs from '.'
const stories = storiesOf('Shared/Tabs', module).addDecorator(
    styles({
        padding: '2rem',
    }),
)
stories.add('default', () => (
    <Tabs
        name="group"
        options={[{label: 'Value 1', value: 'value1'}, {label: 'OtherValue', value: 'value2'}, {label: 'Very long value label', value: 'value3'}]}
        selectedOptionValue="value2"
        onChange={action('selected')}
    />
))
stories.add('disabled', () => (
    <Tabs
        name="group"
        options={[
            {label: 'Value 1', value: 'value1'},
            {label: 'OtherValue', value: 'value2'},
            {label: 'Very long value label', value: 'value3', disabled: true, disabledReason: 'This feature will be available soon!'}]}
        selectedOptionValue="value2"
        onChange={action('selected')}
    />
))
