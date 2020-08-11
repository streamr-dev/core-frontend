// @flow

import React, { useState, useCallback, useMemo } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { withKnobs, text } from '@storybook/addon-knobs'

import StreamPreview from './StreamPreview'

const stories = storiesOf('Marketplace/StreamPreview', module)
    .addDecorator(styles({
        color: '#323232',
        fontSize: '16px',
        height: '100vh',
    }))
    .addDecorator(withKnobs)

const streamList = [{
    id: 'test-stream-1',
    name: 'Ruuvi sensor',
    description: 'Short description',
    requireEncryptedData: false,
    requireSignedData: false,
    partitions: 0,
    config: {},
}, {
    id: 'test-stream-2',
    name: 'Tram Data',
    description: '',
    requireEncryptedData: true,
    requireSignedData: false,
    partitions: 0,
    config: {},
}, {
    id: 'test-stream-3',
    name: 'Third stream',
    description: 'Description that is really long and will break the layout if it goes long enough over the screen',
    requireEncryptedData: false,
    requireSignedData: true,
    partitions: 0,
    config: {},
}]

const streamIds = streamList.map(({ id }) => id)

stories.add('loading stream', () => (
    <StreamPreview
        streamId="1234"
        stream={undefined}
    />
))

stories.add('loading stream (tablet)', () => (
    <StreamPreview
        streamId="1234"
        stream={undefined}
    />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('loading stream (iPhone)', () => (
    <StreamPreview
        streamId="1234"
        stream={undefined}
    />
), {
    viewport: {
        defaultViewport: 'iPhone',
    },
})

const ActiveStream = () => {
    const [streamId, setStreamId] = useState(streamIds[0])

    return (
        <StreamPreview
            streamId={streamId}
            stream={undefined}
            navigableStreamIds={streamIds}
            onChange={setStreamId}
        />
    )
}

stories.add('loading stream with navigation', () => (
    <ActiveStream />
))

stories.add('loading stream with navigation (tablet)', () => (
    <ActiveStream />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('loading stream with navigation (iPhone)', () => (
    <ActiveStream />
), {
    viewport: {
        defaultViewport: 'iPhone',
    },
})

const SwitchStream = () => {
    const [streamId, setStreamId] = useState(streamIds[0])

    return (
        <StreamPreview
            streamId={streamId}
            stream={streamList.find(({ id }) => id === streamId)}
            navigableStreamIds={streamIds}
            onChange={setStreamId}
            titlePrefix={text('Product prefix', '')}
        />
    )
}

stories.add('default', () => (
    <SwitchStream />
))

stories.add('default (tablet)', () => (
    <SwitchStream />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('default (iPhone)', () => (
    <SwitchStream />
), {
    viewport: {
        defaultViewport: 'iPhone',
    },
})
