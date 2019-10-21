// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import TextField from '.'

const stories =
    storiesOf('Marketplace/TextField', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

stories.add('basic', () => (
    <TextField
        placeholder="Add some text"
        onCommit={action('commit')}
    />
))

stories.add('disabled', () => (
    <TextField
        placeholder="Add some text"
        onCommit={action('commit')}
        disabled
    />
))

stories.add('with error', () => (
    <TextField
        placeholder="Add some text"
        error="Something went wrong"
        onCommit={action('commit')}
    />
))
