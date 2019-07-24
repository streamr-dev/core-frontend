// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import ProductsContent from '$newdocs/content/products.mdx'

const Products = () => (
    <DocsLayout subNav={subNav.products}>
        <Helmet title="Products | Streamr Docs" />
        <ProductsContent />
    </DocsLayout>
)

export default Products
