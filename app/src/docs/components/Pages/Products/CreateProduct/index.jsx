// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import CreateProductContent from '$docs/content/products/createDataProduct.mdx'

const CreateProduct = () => (
    <DocsLayout>
        <DocsHelmet title="Create a Product" />
        <section>
            <CreateProductContent />
        </section>
    </DocsLayout>
)

export default CreateProduct
