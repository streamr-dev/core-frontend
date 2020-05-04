// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToMarketplaceContent from '$docs/content/marketplace/introToMarketplace.mdx'

const IntroToMarketplace = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to Marketplace" />
        <section>
            <IntroToMarketplaceContent />
        </section>
    </DocsLayout>
)

export default IntroToMarketplace
