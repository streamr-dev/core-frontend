// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import GettingStartedContent from '$docs/content/gettingStarted.mdx'

const subNav = {
    'create-a-stream': 'Create a Stream',
    'publish-to-a-stream': 'Publish to a Stream',
    'subscribe-to-data': 'Subscribe to data',
    'patterns-for-data-integration': 'Patterns for data integration',
}

const GettingStartedPage = () => (
    <DocsLayout subNav={subNav}>
        <Helmet>
            <title>Getting Started - Streamr Docs</title>
        </Helmet>
        <GettingStartedContent />
    </DocsLayout>
)

export default GettingStartedPage
