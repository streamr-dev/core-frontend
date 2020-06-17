// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import PermissionKeyField from '.'

const stories =
    storiesOf('Userpages/PermissionKeyField', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem 0rem',
            background: 'white',
            border: '1px dashed #DDDDDD',
            margin: '3rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => (
    <PermissionKeyField
        keyName="Key name"
        value={text('Key value', 'Key value')}
        permission="stream_subscribe"
    />
))

stories.add('value hidden', () => (
    <PermissionKeyField
        keyName="Key name"
        value={text('Value', 'Key value')}
        permission="stream_subscribe"
        hideValue
        onSave={action('onSave')}
    />
))

stories.add('editable', () => {
    const saveAction = action('onSave')
    const onSave = (...args) => new Promise((resolve) => {
        saveAction(...args)
        setTimeout(resolve, 500)
    })

    return (
        <PermissionKeyField
            keyName="Key name"
            value={text('Value', 'Key value')}
            permission="stream_subscribe"
            allowEdit
            onSave={onSave}
        />
    )
})

stories.add('truncated value', () => (
    <PermissionKeyField
        keyName="Key name"
        value={text('Value', 'Long value which will truncate')}
        permission="stream_subscribe"
        truncateValue
    />
))

stories.add('truncated value (editable)', () => {
    const saveAction = action('onSave')
    const onSave = (...args) => new Promise((resolve) => {
        saveAction(...args)
        setTimeout(resolve, 500)
    })

    return (
        <PermissionKeyField
            keyName="Key name"
            value={text('Value', 'Long value which will truncate')}
            permission="stream_subscribe"
            allowEdit
            onSave={onSave}
            truncateValue
        />
    )
})
