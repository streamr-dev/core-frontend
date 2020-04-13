// @flow

import React, { useState, useMemo, useCallback } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
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

const streamList = [{
    id: '1',
    name: 'First',
    description: '',
    autoConfigure: false,
    lastUpdated: 0,
    requireEncryptedData: false,
    requireSignedData: false,
    inactivityThresholdHours: 0,
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
    inactivityThresholdHours: 0,
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
    inactivityThresholdHours: 0,
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
    disabled?: boolean,
    availableStreams?: Array<Object>,
    loading?: boolean,
}

const StreamController = ({ error, disabled, availableStreams = [], loading = false }: StreamControllerProps) => {
    const [streams, setStreams] = useState([])

    return (
        <StreamSelector
            streams={streams}
            onEdit={(list) => {
                setStreams(list)
            }}
            availableStreams={availableStreams}
            error={error}
            disabled={disabled}
            fetchingStreams={loading}
        />
    )
}

stories.add('basic', () => (
    <StreamController availableStreams={streamList} />
))

stories.add('with error', () => (
    <StreamController error="Something went wrong" availableStreams={streamList} />
))

stories.add('disabled', () => (
    <StreamController disabled availableStreams={streamList} />
))

stories.add('loading', () => (
    <StreamController availableStreams={streamList} loading />
))

stories.add('empty', () => (
    <StreamController />
))

stories.add('1500 streams', () => {
    const longList = Array.from({
        length: 1500,
    }, (v, i) => ({
        id: i + 1,
        name: `stream ${i + 1}`,
        description: '',
        autoConfigure: false,
        lastUpdated: 0,
        inactivityThresholdHours: 0,
        requireEncryptedData: false,
        requireSignedData: false,
        uiChannel: false,
        storageDays: 0,
        partitions: 0,
        ownPermissions: [],
        config: {},
    }))

    return (
        <StreamController availableStreams={longList} />
    )
})

const LoadMoreController = () => {
    const results = Array.from({
        length: 100,
    }, (v, i) => ({
        id: `${i + 1}`,
        name: `stream ${i + 1}`,
        description: '',
        autoConfigure: false,
        lastUpdated: 0,
        inactivityThresholdHours: 0,
        requireEncryptedData: false,
        requireSignedData: false,
        uiChannel: false,
        storageDays: 0,
        partitions: 0,
        ownPermissions: [],
        config: {},
    }))
    const [streams, setStreams] = useState([])
    const [fetching, setFetching] = useState(false)
    const [amount, setAmount] = useState(10)
    const { partialResults, hasMoreResults } = useMemo(() => ({
        partialResults: results.slice(0, amount),
        hasMoreResults: amount < results.length,
    }), [results, amount])

    const onLoadMore = useCallback(() => {
        if (hasMoreResults) {
            setFetching(true)
            setTimeout(() => {
                setAmount((prev) => prev + 10)
                setFetching(false)
            }, 1500)
        }
    }, [hasMoreResults])

    return (
        <StreamSelector
            streams={streams}
            onEdit={(list) => {
                setStreams(list)
            }}
            availableStreams={partialResults}
            hasMoreResults={hasMoreResults}
            onLoadMore={onLoadMore}
            fetchingStreams={fetching}
        />
    )
}

stories.add('load more', () => (
    <LoadMoreController />
))
