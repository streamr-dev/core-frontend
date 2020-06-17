// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import type { ResourceKey } from '$shared/flowtype/resource-key-types'

import CredentialsControl from '.'

const stories =
    storiesOf('Userpages/CredentialsControl', module)
        .addDecorator(styles({
            color: '#323232',
            background: 'white',
            border: '1px dashed #DDDDDD',
            margin: '3rem',
        }))
        .addDecorator(withKnobs)

const defaultKeys = [{
    id: 'abcdefg1234567',
    name: 'Key 1',
    user: 'user1',
    permission: 'stream_subscribe',
    type: 'STREAM',
}, {
    id: '123456abcefgd',
    name: 'Key 2',
    user: 'user1',
    permission: 'stream_subscribe',
    type: 'STREAM',
}, {
    id: '987654123bgdasaffgaf',
    name: 'Key 3',
    user: 'user1',
    permission: 'stream_publish',
    type: 'STREAM',
}]

type Props = {
    keys: Array<ResourceKey>,
    disabled?: boolean,
    disableDelete?: boolean,
}

const CredentialsControlWrapper = ({ keys, disabled, disableDelete }: Props) => {
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
            disabled={disabled}
            disableDelete={disableDelete}
        />
    )
}

stories.add('basic', () => (
    <CredentialsControlWrapper keys={defaultKeys} />
))

stories.add('empty', () => (
    <CredentialsControlWrapper keys={[]} />
))

stories.add('delete disabled', () => (
    <CredentialsControlWrapper keys={defaultKeys} disableDelete />
))

stories.add('disabled', () => (
    <CredentialsControlWrapper keys={defaultKeys} disabled />
))
