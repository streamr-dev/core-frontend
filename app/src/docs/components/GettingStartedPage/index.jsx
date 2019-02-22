// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import GettingStartedPageContent from './Content.mdx'

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
        <GettingStartedPageContent />
    </DocsLayout>
)

export default GettingStartedPage
