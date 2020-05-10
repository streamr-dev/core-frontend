// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToProductsContent from '$docs/content/products/introToProducts.mdx'

const IntroToProducts = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to products" />
        <section>
            <IntroToProductsContent />
        </section>
    </DocsLayout>
)

export default IntroToProducts
