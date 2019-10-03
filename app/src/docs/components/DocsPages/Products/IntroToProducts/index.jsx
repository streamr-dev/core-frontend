// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToProductsContent from '$docs/content/products/introToProducts.mdx'

const IntroToProducts = () => (
    <DocsLayout>
        <Helmet title="Intro to products | Streamr Docs" />
        <section id="intro-to-products">
            <IntroToProductsContent />
        </section>
    </DocsLayout>
)

export default IntroToProducts
