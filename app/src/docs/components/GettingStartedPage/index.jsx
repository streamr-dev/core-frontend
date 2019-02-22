// @flow

import React from 'react'

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
        <GettingStartedPageContent />
    </DocsLayout>
)

export default GettingStartedPage
