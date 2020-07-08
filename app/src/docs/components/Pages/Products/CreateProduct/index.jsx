// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import CreateProductContent from '$docs/content/products/CreateProduct.mdx'

const CreateProduct = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to Data Unions" />
        <section>
            <CreateProductContent />
        </section>
    </DocsLayout>
)

export default CreateProduct
