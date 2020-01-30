// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import CommunityProductsContent from '$docs/content/products/communityProducts.mdx'

const CommunityProducts = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Data Unions" />
        <section>
            <CommunityProductsContent />
        </section>
    </DocsLayout>
)

export default CommunityProducts
