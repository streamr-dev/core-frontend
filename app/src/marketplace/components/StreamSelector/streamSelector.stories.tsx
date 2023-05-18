import React, { useState } from 'react'
import {Meta} from "@storybook/react"
import StreamSelector from '.'

const streamList = [
    {
        id: 'stream-1',
        description: '',
        autoConfigure: false,
        lastUpdated: 0,
        requireEncryptedData: false,
        requireSignedData: false,
        inactivityThresholdHours: 0,
        uiChannel: false,
        storageDays: 0,
        partitions: 0,
        config: {},
    },
    {
        id: 'stream-2',
        description: '',
        autoConfigure: false,
        lastUpdated: 0,
        requireEncryptedData: false,
        inactivityThresholdHours: 0,
        requireSignedData: false,
        uiChannel: false,
        storageDays: 0,
        partitions: 0,
        config: {},
    },
    {
        id: 'stream-3',
        description: '',
        autoConfigure: false,
        lastUpdated: 0,
        inactivityThresholdHours: 0,
        requireEncryptedData: false,
        requireSignedData: false,
        uiChannel: false,
        storageDays: 0,
        partitions: 0,
        config: {},
    },
]
type StreamControllerProps = {
    error?: string
    disabled?: boolean
    availableStreams?: Array<Record<string, any>>
    loading?: boolean
}

const StreamController = ({
    error,
    disabled,
    availableStreams = [],
    loading = false,
}: StreamControllerProps) => {
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

export const Basic = () => <StreamController availableStreams={streamList} />

const meta: Meta<typeof Basic> = {
    title: 'Marketplace/StreamSelector',
    component: Basic,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

Basic.story = {
    name: 'basic',
}

export const WithError = () => (
    <StreamController error="Something went wrong" availableStreams={streamList} />
)

WithError.story = {
    name: 'with error',
}

export const Disabled = () => <StreamController disabled availableStreams={streamList} />

Disabled.story = {
    name: 'disabled',
}

export const Loading = () => <StreamController availableStreams={streamList} loading />

Loading.story = {
    name: 'loading',
}

export const Empty = () => <StreamController />

Empty.story = {
    name: 'empty',
}

export const AlotOfStreams = () => {
    const longList = Array.from(
        {
            length: 1500,
        },
        (v, i) => ({
            id: `stream-${i + 1}`,
            description: '',
            autoConfigure: false,
            lastUpdated: 0,
            inactivityThresholdHours: 0,
            requireEncryptedData: false,
            requireSignedData: false,
            uiChannel: false,
            storageDays: 0,
            partitions: 0,
            config: {},
        }),
    )
    return <StreamController availableStreams={longList} />
}

AlotOfStreams.story = {
    name: '1500 streams',
}
