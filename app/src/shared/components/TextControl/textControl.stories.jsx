// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import TextControl from '.'

const stories =
    storiesOf('Shared/TextControl', module)
        .addDecorator(styles({
            color: '#323232',
        }))

stories.add('enhanced', () => (
    <TextControl
        flushHistoryOnBlur
        immediateCommit={false}
        onCommit={action('Commit')}
        commitEmpty={false}
        revertOnEsc
        selectAllOnFocus
        value="Lorem ipsum."
    />
))

stories.add('revert on Escape', () => (
    <TextControl
        onCommit={action('Commit')}
        revertOnEsc
        value="Lorem ipsum."
    />
))

stories.add('require value', () => (
    <TextControl
        onCommit={action('Commit')}
        commitEmpty={false}
        value="Lorem ipsum."
    />
))

stories.add('commit on Enter', () => (
    <TextControl
        immediateCommit={false}
        onCommit={action('Commit')}
        value="Lorem ipsum."
    />
))

stories.add('select all on focus', () => (
    <TextControl
        onCommit={action('Commit')}
        selectAllOnFocus
        value="Lorem ipsum."
    />
))

stories.add('prevent undo after blur', () => (
    <TextControl
        flushHistoryOnBlur
        value="Lorem ipsum."
    />
))
