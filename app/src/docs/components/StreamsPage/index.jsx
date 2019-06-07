// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import StreamsContent from '$docs/content/streams.mdx'

const StreamrEnginePage = () => (
    <DocsLayout>
        <Helmet>
            <title>Streamr Docs | Streams</title>
        </Helmet>
        <StreamsContent />
    </DocsLayout>
)

export default StreamrEnginePage
