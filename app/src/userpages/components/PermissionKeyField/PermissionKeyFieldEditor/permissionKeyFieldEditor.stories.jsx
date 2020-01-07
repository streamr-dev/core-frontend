// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import PermissionKeyFieldEditor from '.'

const stories =
    storiesOf('Userpages/PermissionKeyFieldEditor', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem 0rem',
            background: 'white',
            border: '1px dashed #DDDDDD',
            margin: '3rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
    />
))

stories.add('default (address)', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
        valueLabel="address"
    />
))

stories.add('default (private key)', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
        valueLabel="privateKey"
    />
))

stories.add('edit value', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
        editValue
    />
))

stories.add('create new', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
        createNew
    />
))

stories.add('create new with value', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
        createNew
        editValue
    />
))

stories.add('waiting', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        waiting
        onCancel={action('onCancel')}
        onSave={action('onSave')}
    />
))

stories.add('error', () => (
    <PermissionKeyFieldEditor
        keyName="key"
        value="value"
        onCancel={action('onCancel')}
        onSave={action('onSave')}
        error="Something went wrong"
    />
))
