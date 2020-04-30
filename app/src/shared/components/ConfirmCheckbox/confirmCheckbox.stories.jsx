// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import ConfirmCheckbox from '.'

const stories =
    storiesOf('Shared/ConfirmCheckbox', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '1rem',
            fontSize: '16px',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => (
    <ConfirmCheckbox
        title="Are you sure?"
        subtitle="This is an unrecoverable action"
        onToggle={action('onToggle')}
    />
))

stories.add('disabled', () => (
    <ConfirmCheckbox
        title="Are you sure?"
        subtitle="This is an unrecoverable action"
        onToggle={action('onToggle')}
        disabled
    />
))
