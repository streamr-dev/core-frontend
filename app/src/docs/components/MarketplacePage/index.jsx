// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import MarketplacePageContent from '$docs/content/marketplace.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const MarketplacePage = () => (
    <DocsLayout subNav={subNav.marketplace}>
        <Helmet title="Streamr Docs | Marketplace" />
        <MarketplacePageContent />
    </DocsLayout>
)

export default MarketplacePage
