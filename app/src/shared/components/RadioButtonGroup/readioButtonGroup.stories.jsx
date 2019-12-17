// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import RadioButtonGroup from '.'

const stories =
    storiesOf('Shared/RadioButtonGroup', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '2rem',
        }))

stories.add('default', () => (
    <RadioButtonGroup
        name="group"
        options={['value 1', 'value 2', 'value 3']}
        selectedOption="value 2"
        onChange={action('selected')}
    />
))

stories.add('disabled', () => (
    <RadioButtonGroup
        name="group"
        options={['value 1', 'value 2', 'value 3']}
        selectedOption="value 2"
        onChange={action('selected')}
        disabled
    />
))
