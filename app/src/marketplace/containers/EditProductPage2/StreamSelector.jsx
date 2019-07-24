// @flow

import React from 'react'

import StreamSelectorComponent from '$mp/components/StreamSelector'

const StreamSelector = () => (
    <div>
        <h1>Add streams</h1>
        <p>Products can contain a range of streams, or a single &quot;firehose&quot; type stream, it&apos;s up to you.
            If you haven&apos;t made any streams yet, you can create one here. For help creating streams, see the docs.
        </p>
        <StreamSelectorComponent
            availableStreams={[]}
            fetchingStreams={false}
            onEdit={() => {}}
            streams={[]}
        />
    </div>
)

export default StreamSelector
