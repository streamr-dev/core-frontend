// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import UseState from '$shared/components/UseState'
import TextControl from '.'

const stories =
    storiesOf('Shared/TextControl', module)
        .addDecorator(styles({
            color: '#323232',
        }))

stories.add('enhanced', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                flushHistoryOnBlur
                immediateCommit={false}
                commitEmpty={false}
                revertOnEsc
                selectAllOnFocus
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
))

stories.add('revert on Escape', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                revertOnEsc
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
))

stories.add('require value', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                commitEmpty={false}
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
))

stories.add('commit on Enter', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                immediateCommit={false}
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
))

stories.add('select all on focus', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                selectAllOnFocus
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
))

stories.add('prevent undo after blur', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                flushHistoryOnBlur
                onCommit={setValue}
                value={value}
            />
        )}
    </UseState>
))

stories.add('update prop on commit', () => (
    <UseState initialValue="0">
        {(value, setValue) => (
            <TextControl
                immediateCommit={false}
                onCommit={(v) => {
                    setValue(Number(v) + 1)
                }}
                value={value}
            />
        )}
    </UseState>
))

stories.add('textarea', () => (
    <UseState initialValue="Lorem ipsum.">
        {(value, setValue) => (
            <TextControl
                tag="textarea"
                value={value}
                onCommit={setValue}
            />
        )}
    </UseState>
))
