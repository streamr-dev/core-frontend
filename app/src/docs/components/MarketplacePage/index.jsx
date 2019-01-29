// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import MarketplacePageContent from './Content.mdx'

const subNav = {
    'create-a-product': 'Create a Product',
}

const MarketplacePage = () => (
    <DocsLayout subNav={subNav}>
        <MarketplacePageContent />
    </DocsLayout>
)

export default MarketplacePage
