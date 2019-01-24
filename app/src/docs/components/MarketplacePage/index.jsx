// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import MarketplacePageContent from './Content.mdx'

const subNav = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const MarketplacePage = () => (
    <DocsLayout subNav={subNav}>
        <MarketplacePageContent />
    </DocsLayout>
)

export default MarketplacePage
