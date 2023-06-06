import React, { useState, useEffect } from 'react'
import { Meta } from '@storybook/react'
import { StreamPreview } from './'

const streamList = [
    {
        id: 'test-stream-1',
        description: 'Short description',
        requireEncryptedData: false,
        requireSignedData: false,
        partitions: 0,
        config: {},
    },
    {
        id: 'test-stream-2',
        description: '',
        requireEncryptedData: true,
        requireSignedData: false,
        partitions: 0,
        config: {},
    },
    {
        id: 'test-stream-3',
        description:
            'Description that is really long and will break the layout if it goes long enough over the screen',
        requireEncryptedData: false,
        requireSignedData: true,
        partitions: 5,
        config: {},
    },
]

const generateData = (rows) =>
    [...new Array(rows)].map((value, index) => {
        const factor = index + 1
        const timestamp = new Date('2020-08-19T13:36:00')
        timestamp.setMinutes(timestamp.getMinutes() + factor)
        return {
            metadata: {
                timestamp: timestamp.getTime(),
            },
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

export const LoadingStream = () => (
    <StreamPreview
        streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
    />
)

LoadingStream.story = {
    name: 'loading stream',
}

const meta: Meta<typeof LoadingStream> = {
    title: 'Marketplace/StreamPreview',
    component: LoadingStream,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        fontSize: '16px',
                        height: '100vh',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const LoadingStreamTablet = () => (
    <StreamPreview
        streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
    />
)

LoadingStreamTablet.story = {
    name: 'loading stream (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const LoadingStreamIPhone = () => (
    <StreamPreview
        streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
    />
)

LoadingStreamIPhone.story = {
    name: 'loading stream (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const ActiveStream = () => {
    const [streamId, setStreamId] = useState(streamIds[0])
    return (
        <StreamPreview
            streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
        />
    )
}

export const LoadingStreamWithNavigation = () => <ActiveStream />

LoadingStreamWithNavigation.story = {
    name: 'loading stream with navigation',
}

export const LoadingStreamWithNavigationTablet = () => <ActiveStream />

LoadingStreamWithNavigationTablet.story = {
    name: 'loading stream with navigation (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const LoadingStreamWithNavigationIPhone = () => <ActiveStream />

LoadingStreamWithNavigationIPhone.story = {
    name: 'loading stream with navigation (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const PrefixedPreview = () => {
    const [streamId, setStreamId] = useState(streamIds[0])
    const linkToStreamSettings = true
    const [activePartition, setActivePartition] = useState(0)
    useEffect(() => {
        setActivePartition(0)
    }, [streamId])
    return (
        <StreamPreview
            streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
        />
    )
}

export const StreamPrefixSettingsLink = () => <PrefixedPreview />

StreamPrefixSettingsLink.story = {
    name: 'stream prefix & settings link',
}

export const StreamPrefixSettingsLinkTablet = () => <PrefixedPreview />

StreamPrefixSettingsLinkTablet.story = {
    name: 'stream prefix & settings link (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const StreamPrefixSettingsLinkIPhone = () => <PrefixedPreview />

StreamPrefixSettingsLinkIPhone.story = {
    name: 'stream prefix & settings link (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const DefaultPreview = () => {
    const [streamId, setStreamId] = useState(streamIds[0])
    const [activePartition, setActivePartition] = useState(0)
    useEffect(() => {
        setActivePartition(0)
    }, [streamId])
    return (
        <StreamPreview
            streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
        />
    )
}

export const Default = () => <DefaultPreview />

Default.story = {
    name: 'default',
}

export const DefaultTablet = () => <DefaultPreview />

DefaultTablet.story = {
    name: 'default (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const DefaultIPhone = () => <DefaultPreview />

DefaultIPhone.story = {
    name: 'default (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const ErrorView = () => (
    <StreamPreview
        streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
    />
)

export const ErrorState = () => <ErrorView />

ErrorState.story = {
    name: 'error state',
}

export const ErrorStateTablet = () => <ErrorView />

ErrorStateTablet.story = {
    name: 'error state (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const ErrorStateIPhone = () => <ErrorView />

ErrorStateIPhone.story = {
    name: 'error state (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}
