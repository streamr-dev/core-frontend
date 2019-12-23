// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import CredentialsControl from '.'

const stories =
    storiesOf('Userpages/CredentialsControl', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '3rem',
            background: 'white',
        }))
        .addDecorator(withKnobs)

const keys = [{
    id: 'abcdefg1234567',
    name: 'Key 1',
    user: 'user1',
    permission: 'write',
    type: 'STREAM',
}, {
    id: '123456abcefgd',
    name: 'Key 2',
    user: 'user1',
    permission: 'read',
    type: 'STREAM',
}, {
    id: '987654123bgdasaffgaf',
    name: 'Key 3',
    user: 'user1',
    permission: 'write',
    type: 'STREAM',
}]

type Props = {
    showPermissionType?: boolean,
}

const CredentialsControlWrapper = ({ showPermissionType = false }: Props) => {
    const addAction = action('addKey')
    const removeAction = action('removeKey')
    const saveAction = action('onSave')

    const addKey = (...args) => new Promise((resolve) => {
        addAction(...args)

        setTimeout(resolve, 500)
    })
    const removeKey = (...args) => new Promise((resolve) => {
        removeAction(...args)

        setTimeout(resolve, 500)
    })
    const onSave = (...args) => new Promise((resolve) => {
        saveAction(...args)

        setTimeout(resolve, 500)
    })

    return (
        <CredentialsControl
            keys={keys}
            addKey={addKey}
            onSave={onSave}
            removeKey={removeKey}
            showPermissionType={showPermissionType}
        />
    )
}

stories.add('basic', () => (
    <CredentialsControlWrapper />
))

stories.add('with permission', () => (
    <CredentialsControlWrapper showPermissionType />
))
