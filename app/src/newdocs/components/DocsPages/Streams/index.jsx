// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import StreamsContent from '$newdocs/content/streams.mdx'

const Streams = () => (
    <DocsLayout subNav={subNav.streams}>
        <Helmet title="Streamr Docs | Streams" />
        <StreamsContent />
    </DocsLayout>
)

export default Streams
