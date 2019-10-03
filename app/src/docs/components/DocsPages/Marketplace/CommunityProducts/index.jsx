// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import CommunityProductsContent from '$docs/content/marketplace/communityProducts.mdx'

const CommunityProducts = () => (
    <DocsLayout>
        <Helmet title="Community products | Streamr Docs" />
        <section>
            <CommunityProductsContent />
        </section>
    </DocsLayout>
)

export default CommunityProducts
