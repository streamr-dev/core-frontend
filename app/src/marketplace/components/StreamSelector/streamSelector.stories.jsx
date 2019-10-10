// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'

import StreamSelector from '.'

const stories =
    storiesOf('Marketplace/StreamSelector', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const availableStreams = [{
    id: '1',
    name: 'First',
    description: '',
    autoConfigure: false,
    lastUpdated: 0,
    requireEncryptedData: false,
    requireSignedData: false,
    uiChannel: false,
    storageDays: 0,
    partitions: 0,
    ownPermissions: [],
    config: {},
}, {
    id: '2',
    name: 'Second',
    description: '',
    autoConfigure: false,
    lastUpdated: 0,
    requireEncryptedData: false,
    requireSignedData: false,
    uiChannel: false,
    storageDays: 0,
    partitions: 0,
    ownPermissions: [],
    config: {},
}, {
    id: '3',
    name: 'Third',
    description: '',
    autoConfigure: false,
    lastUpdated: 0,
    requireEncryptedData: false,
    requireSignedData: false,
    uiChannel: false,
    storageDays: 0,
    partitions: 0,
    ownPermissions: [],
    config: {},
}]

type StreamControllerProps = {
    error?: string,
}

const StreamController = ({ error }: StreamControllerProps) => {
    const [streams, setStreams] = useState([])

    return (
        <StreamSelector
            streams={streams}
            onEdit={(list) => {
                setStreams(list)
            }}
            availableStreams={availableStreams}
            error={error}
        />
    )
}

stories.add('basic', () => (
    <StreamController />
))

stories.add('with error', () => (
    <StreamController error="Something went wrong" />
))

stories.add('empty', () => (
    <StreamSelector
        streams={[]}
        onEdit={action('update')}
        availableStreams={[]}
    />
))
