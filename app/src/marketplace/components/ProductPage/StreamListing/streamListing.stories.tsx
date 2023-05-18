import React, { useReducer, useMemo, useCallback } from 'react'
import {Meta} from "@storybook/react"
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import StreamListingWithContainer, { StreamListing } from './'
const Container = styled.div`
    padding: 3rem;
`
const streamList = [
    {
        id: 'test-stream-1',
        name: 'Ruuvi sensor',
        description: 'Short description',
        requireEncryptedData: false,
        requireSignedData: false,
        partitions: 0,
        config: {},
    },
    {
        id: 'test-stream-2',
        name: 'Tram Data',
        description: '',
        requireEncryptedData: true,
        requireSignedData: false,
        partitions: 0,
        config: {},
    },
    {
        id: 'test-stream-3',
        name: 'Third stream',
        description:
            'Description that is really long and will break the layout if it goes long enough over the screen',
        requireEncryptedData: false,
        requireSignedData: true,
        partitions: 5,
        config: {},
    },
]
const longStreamList = [...Array(1000)].map((value, index) => ({
    id: `test-stream-${index}`,
    name: `Stream ${index}`,
    description: `Description ${index}`,
    requireEncryptedData: false,
    requireSignedData: false,
    partitions: 0,
    config: {},
}))

const DefaultView = () => {
    const showPreview = true
    const showSettings = true
    return (
        <StreamListingWithContainer
            streams={streamList}
            totalStreams={streamList.length}
            onStreamPreview={!!showPreview && action('onStreamPreview')}
            onStreamSettings={!!showSettings && action('onStreamSettings')}
        />
    )
}

const meta: Meta<typeof DefaultView> = {
    title: 'Marketplace/StreamListing',
    component: DefaultView,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            fontSize: '16px',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

export const Default = () => <DefaultView />

Default.story = {
    name: 'Default',
}

export const DefaultTablet = () => <DefaultView />

DefaultTablet.story = {
    name: 'Default (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const DefaultIPhone = () => <DefaultView />

DefaultIPhone.story = {
    name: 'Default (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const FetchingView = () => {
    const showPreview = true
    const showSettings = true
    return (
        <StreamListingWithContainer
            streams={[]}
            onStreamPreview={!!showPreview && action('onStreamPreview')}
            onStreamSettings={!!showSettings && action('onStreamSettings')}
            fetchingStreams
            locked={false}
        />
    )
}

export const FetchingStreams = () => <FetchingView />

FetchingStreams.story = {
    name: 'Fetching streams',
}

export const FetchingStreamsTablet = () => <FetchingView />

FetchingStreamsTablet.story = {
    name: 'Fetching streams (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const FetchingStreamsIPhone = () => <FetchingView />

FetchingStreamsIPhone.story = {
    name: 'Fetching streams (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const EmptyView = () => {
    const showPreview = true
    const showSettings = true
    return (
        <StreamListingWithContainer
            streams={[]}
            totalStreams={0}
            onStreamPreview={!!showPreview && action('onStreamPreview')}
            onStreamSettings={!!showSettings && action('onStreamSettings')}
            locked={false}
        />
    )
}

export const Empty = () => <EmptyView />

Empty.story = {
    name: 'Empty',
}

export const EmptyTablet = () => <EmptyView />

EmptyTablet.story = {
    name: 'Empty (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const EmptyIPhone = () => <EmptyView />

EmptyIPhone.story = {
    name: 'Empty (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const LongListView = () => {
    const showPreview = true
    const showSettings = true
    return (
        <StreamListingWithContainer
            streams={longStreamList}
            totalStreams={longStreamList.length}
            onStreamPreview={!!showPreview && action('onStreamPreview')}
            onStreamSettings={!!showSettings && action('onStreamSettings')}
        />
    )
}

export const LongList = () => <LongListView />

LongList.story = {
    name: 'Long list',
}

export const LongListTablet = () => <LongListView />

LongListTablet.story = {
    name: 'Long list (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const LongListIPhone = () => <LongListView />

LongListIPhone.story = {
    name: 'Long list (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const LockedView = () => {
    const showPreview = true
    const showSettings = true
    return (
        <StreamListingWithContainer
            streams={streamList}
            totalStreams={streamList.length}
            onStreamPreview={!!showPreview && action('onStreamPreview')}
            onStreamSettings={!!showSettings && action('onStreamSettings')}
            locked
        />
    )
}

export const Locked = () => <LockedView />

Locked.story = {
    name: 'Locked',
}

export const LockedTablet = () => <LockedView />

LockedTablet.story = {
    name: 'Locked (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const LockedIPhone = () => <LockedView />

LockedIPhone.story = {
    name: 'Locked (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const WithoutContainerView = () => {
    const showPreview = true
    const showSettings = true
    return (
        <Container>
            <StreamListing
                streams={streamList}
                totalStreams={streamList.length}
                onStreamPreview={!!showPreview && action('onStreamPreview')}
                onStreamSettings={!!showSettings && action('onStreamSettings')}
            />
        </Container>
    )
}

export const WithoutContainer = () => <WithoutContainerView />

WithoutContainer.story = {
    name: 'Without container',
}

export const WithoutContainerTablet = () => <WithoutContainerView />

WithoutContainerTablet.story = {
    name: 'Without container (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const WithoutContainerIPhone = () => <WithoutContainerView />

WithoutContainerIPhone.story = {
    name: 'Without container (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}

const PAGE_SIZE = 100

const LoadingMoreListView = () => {
    const showPreview = true
    const showSettings = true
    const [page, advancePage] = useReducer((p) => p + 1, 1)
    const [visibleStreams, hasMoreResults] = useMemo(() => {
        const nextItems = longStreamList.slice(0, page * PAGE_SIZE)
        return [nextItems, nextItems.length < longStreamList.length]
    }, [page])
    const onLoadMore = useCallback(() => {
        advancePage()
    }, [advancePage])
    return (
        <StreamListingWithContainer
            streams={visibleStreams}
            totalStreams={longStreamList.length}
            hasMoreResults={hasMoreResults}
            onLoadMore={onLoadMore}
            onStreamPreview={!!showPreview && action('onStreamPreview')}
            onStreamSettings={!!showSettings && action('onStreamSettings')}
        />
    )
}

export const LoadingMore = () => <LoadingMoreListView />

LoadingMore.story = {
    name: 'Loading more',
}

export const LoadingMoreTablet = () => <LoadingMoreListView />

LoadingMoreTablet.story = {
    name: 'Loading more (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const LoadingMoreIPhone = () => <LoadingMoreListView />

LoadingMoreIPhone.story = {
    name: 'Loading more (iPhone)',

    parameters: {
        viewport: {
            defaultViewport: 'iPhone',
        },
    },
}
