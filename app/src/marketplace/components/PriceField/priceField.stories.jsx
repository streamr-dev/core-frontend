// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import PriceField from '.'

const stories =
    storiesOf('Marketplace/PriceField', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

stories.add('basic', () => (
    <PriceField
        currency="USD"
        placeholder="Price"
        onCommit={action('commit')}
    />
))

stories.add('disabled', () => (
    <PriceField
        currency="USD"
        placeholder="Price"
        onCommit={action('commit')}
        disabled
    />
))

stories.add('with error', () => (
    <PriceField
        currency="USD"
        placeholder="Price"
        error="Something went wrong"
        onCommit={action('commit')}
    />
))
