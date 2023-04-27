import React, { useState, useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import { StreamPreview } from './'
const stories = storiesOf('Marketplace/StreamPreview', module)
    .addDecorator(
        styles({
            color: '#323232',
            fontSize: '16px',
            height: '100vh',
        }),
    )
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
        description: 'Description that is really long and will break the layout if it goes long enough over the screen',
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
stories.add('loading stream', () => (
    <StreamPreview
        streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
    />
))
stories.add(
    'loading stream (tablet)',
    () => (
        <StreamPreview
            streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
        />
    ),
    {
        viewport: {
            defaultViewport: 'md',
        },
    },
)
stories.add(
    'loading stream (iPhone)',
    () => (
        <StreamPreview
            streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
        />
    ),
    {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
)

const ActiveStream = () => {
    const [streamId, setStreamId] = useState(streamIds[0])
    return (
        <StreamPreview
            streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
        />
    )
}

stories.add('loading stream with navigation', () => <ActiveStream />)
stories.add('loading stream with navigation (tablet)', () => <ActiveStream />, {
    viewport: {
        defaultViewport: 'md',
    },
})
stories.add('loading stream with navigation (iPhone)', () => <ActiveStream />, {
    viewport: {
        defaultViewport: 'iPhone',
    },
})

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

stories.add('stream prefix & settings link', () => <PrefixedPreview />)
stories.add('stream prefix & settings link (tablet)', () => <PrefixedPreview />, {
    viewport: {
        defaultViewport: 'md',
    },
})
stories.add('stream prefix & settings link (iPhone)', () => <PrefixedPreview />, {
    viewport: {
        defaultViewport: 'iPhone',
    },
})

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

stories.add('default', () => <DefaultPreview />)
stories.add('default (tablet)', () => <DefaultPreview />, {
    viewport: {
        defaultViewport: 'md',
    },
})
stories.add('default (iPhone)', () => <DefaultPreview />, {
    viewport: {
        defaultViewport: 'iPhone',
    },
})

const ErrorView = () => (
    <StreamPreview
        streamsList={['0x4855a3caa2d338349feb918fc65b4d7184540dbe/lorem292929']}
    />
)

stories.add('error state', () => <ErrorView />)
stories.add('error state (tablet)', () => <ErrorView />, {
    viewport: {
        defaultViewport: 'md',
    },
})
stories.add('error state (iPhone)', () => <ErrorView />, {
    viewport: {
        defaultViewport: 'iPhone',
    },
})
