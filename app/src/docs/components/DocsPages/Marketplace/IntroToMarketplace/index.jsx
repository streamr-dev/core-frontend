// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToMarketplaceContent from '$docs/content/marketplace/introToMarketplace.mdx'

const IntroToMarketplace = () => (
    <DocsLayout>
        <Helmet title="Intro to Marketplace | Streamr Docs" />
        <section>
            <IntroToMarketplaceContent />
        </section>
    </DocsLayout>
)

export default IntroToMarketplace
