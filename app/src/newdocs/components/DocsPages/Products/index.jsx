// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToProducts from '$newdocs/content/products/introToProducts.mdx'
import WorkWithProductsInCore from '$newdocs/content/products/workWithProductsInCore.mdx'
import CommunityProducts from '$newdocs/content/products/communityProducts.mdx'

const Products = () => (
    <DocsLayout subNav={subNav.products}>
        <Helmet title="Products | Streamr Docs" />
        <section id="intro-to-products">
            <IntroToProducts />
        </section>
        <section id="work-with-products-in-core">
            <WorkWithProductsInCore />
        </section>
        <section id="community-products">
            <CommunityProducts />
        </section>
    </DocsLayout>
)

export default Products
