// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToMarketplaceContent from '$docs/content/marketplace/introToMarketplace.mdx'

const IntroToMarketplace = () => (
    <DocsLayout>
        <DocsHelmet title="Intro to Marketplace" />
        <section>
            <IntroToMarketplaceContent />
        </section>
    </DocsLayout>
)

export default IntroToMarketplace
