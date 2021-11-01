// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import CreatingDataProductsContent from '$docs/content/marketplace/creatingDataProducts.mdx'

const CreatingDataProducts = () => (
    <DocsLayout>
        <DocsHelmet title="Creating data products" />
        <section>
            <CreatingDataProductsContent />
        </section>
    </DocsLayout>
)

export default CreatingDataProducts
