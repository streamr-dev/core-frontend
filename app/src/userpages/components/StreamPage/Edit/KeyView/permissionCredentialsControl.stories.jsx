// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import PermissionCredentialsControl from '.'

const stories =
    storiesOf('Userpages/PermissionCredentialsControl', module)
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
    permission: 'stream_subscribe',
    type: 'STREAM',
}]

stories.add('basic', () => (
    <PermissionCredentialsControl keys={defaultKeys} />
))

stories.add('empty', () => (
    <PermissionCredentialsControl keys={[]} />
))
