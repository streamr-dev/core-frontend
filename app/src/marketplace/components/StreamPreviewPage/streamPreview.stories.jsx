// @flow

import React, { useState, useCallback, useMemo } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'

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
    partitions: 5,
    config: {},
}]

const generateData = (rows) => [...new Array(rows)].map((value, index) => {
    const factor = index + 1
    const timestamp = new Date('2020-01-21 14:31:34.166')
    timestamp.setMinutes(factor)
    return {
        timestamp: timestamp.toISOString(),
        data: {
            NO2: factor * 14,
            CO2: factor * 405,
            PM: factor * 2.5,
            temp: factor * 18.5,
            pressure: factor * 1029.1,
        },
    }
})

const streamData = {
    [streamList[0].id]: generateData(10),
    [streamList[1].id]: generateData(2),
    [streamList[2].id]: generateData(25),
}

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

const PrefixedPreview = () => {
    const [streamId, setStreamId] = useState(streamIds[0])

    return (
        <StreamPreview
            streamId={streamId}
            stream={streamList.find(({ id }) => id === streamId)}
            navigableStreamIds={streamIds}
            onChange={setStreamId}
            titlePrefix={text('Product prefix', 'Tram Data')}
            linkToStreamSettings={boolean('Link to settings', true)}
        />
    )
}

stories.add('stream prefix & settings link', () => (
    <PrefixedPreview />
))

stories.add('stream prefix & settings link (tablet)', () => (
    <PrefixedPreview />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('stream prefix & settings link (iPhone)', () => (
    <PrefixedPreview />
), {
    viewport: {
        defaultViewport: 'iPhone',
    },
})

const DefaultPreview = () => {
    const [streamId, setStreamId] = useState(streamIds[0])

    return (
        <StreamPreview
            streamId={streamId}
            stream={streamList.find(({ id }) => id === streamId)}
            navigableStreamIds={streamIds}
            onChange={setStreamId}
            streamData={streamData[streamId]}
        />
    )
}

stories.add('default', () => (
    <DefaultPreview />
))

stories.add('default (tablet)', () => (
    <DefaultPreview />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('default (iPhone)', () => (
    <DefaultPreview />
), {
    viewport: {
        defaultViewport: 'iPhone',
    },
})
