// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import MarkdownEditor from '.'

const stories =
    storiesOf('Marketplace/MarkdownEditor', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

stories.add('basic', () => (
    <MarkdownEditor
        placeholder="Type here"
        onCommit={action('commit')}
    />
))

stories.add('with error', () => (
    <MarkdownEditor
        placeholder="Type here"
        onCommit={action('commit')}
        error="Something went wrong"
    />
))
