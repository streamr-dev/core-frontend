// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import MarketplacePageContent from '$newdocs/content/marketplace.mdx'

const Marketplace = () => (
    <DocsLayout subNav={subNav.marketplace}>
        <Helmet title="Marketplace | Streamr Docs" />
        <MarketplacePageContent />
    </DocsLayout>
)

export default Marketplace
