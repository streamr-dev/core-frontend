// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import MarketplacePageContent from './Content.mdx'

const subNavigationItems = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const MarketplacePage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <MarketplacePageContent />
    </DocsLayout>
)

export default MarketplacePage
