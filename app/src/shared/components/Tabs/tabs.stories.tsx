import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import Tabs from '.'
const stories = storiesOf('Shared/Tabs', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000'
    }),
)
stories.add('default', () => (
    <Tabs
        options={[{label: 'Value 1', value: 'value1'}, {label: 'OtherValue', value: 'value2'}, {label: 'Very long value label', value: 'value3'}]}
        selectedOptionValue="value2"
        onChange={action('selected')}
    />
))
stories.add('disabled', () => (
    <Tabs
        options={[
            {label: 'Value 1', value: 'value1'},
            {label: 'OtherValue', value: 'value2'},
            {label: 'Very long value label', value: 'value3', disabled: true, disabledReason: 'This feature will be available soon!'}]}
        selectedOptionValue="value2"
        onChange={action('selected')}
    />
))
stories.add('fullWidth', () => (
    <>
        <div style={{marginBottom: '20px'}}>
            <p>Always:</p>
            <Tabs
                options={[
                    {label: 'Value 1', value: 'value1'},
                    {label: 'OtherValue', value: 'value2'},
                    {label: 'Very long value label', value: 'value3'}
                ]}
                selectedOptionValue="value2"
                onChange={action('selected')}
                fullWidth={'on'}
            />
        </div>
        <div style={{marginBottom: '20px'}}>
            <p>Up until desktop resolutions:</p>
            <Tabs
                options={[
                    {label: 'Value 1', value: 'value1'},
                    {label: 'OtherValue', value: 'value2'},
                    {label: 'Very long value label', value: 'value3'}
                ]}
                selectedOptionValue="value2"
                onChange={action('selected')}
                fullWidth={'mobileAndTablet'}
            />
        </div>
        <div style={{marginBottom: '20px'}}>
            <p>Up until tablet resolutions:</p>
            <Tabs
                options={[
                    {label: 'Value 1', value: 'value1'},
                    {label: 'OtherValue', value: 'value2'},
                    {label: 'Very long value label', value: 'value3'}
                ]}
                selectedOptionValue="value2"
                onChange={action('selected')}
                fullWidth={'onlyMobile'}
            />
        </div>
    </>
))
