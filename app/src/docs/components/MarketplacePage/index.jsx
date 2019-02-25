// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import MarketplacePageContent from '$docs/content/marketplace.mdx'

const subNav = {
    'create-a-product': 'Create a Product',
}

const MarketplacePage = () => (
    <DocsLayout subNav={subNav}>
        <Helmet>
            <title>Marketplace - Streamr Docs</title>
        </Helmet>
        <MarketplacePageContent />
    </DocsLayout>
)

export default MarketplacePage
