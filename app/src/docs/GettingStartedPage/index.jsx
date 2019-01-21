// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import GettingStartedPageContent from './Content.mdx'

const subNavigationItems = {
    'create-a-stream': 'Create a Stream',
    'get-your-stream-id': 'Get your Stream ID',
    'publish-to-a-stream': 'Publish to a Stream',
}

const GettingStartedPage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <GettingStartedPageContent />
    </DocsLayout>
)

export default GettingStartedPage
