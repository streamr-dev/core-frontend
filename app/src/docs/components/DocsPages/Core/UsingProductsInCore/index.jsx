// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingProductsInCoreContent from '$docs/content/core/usingProductsInCore.mdx'

const UsingProductsInCore = () => (
    <DocsLayout >
        <Helmet title="Using products in Core | Streamr Docs" />
        <section>
            <UsingProductsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingProductsInCore
