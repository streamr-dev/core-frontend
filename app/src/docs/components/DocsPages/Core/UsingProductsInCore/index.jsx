// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingProductsInCoreContent from '$docs/content/core/usingProductsInCore.mdx'

const UsingProductsInCore = () => (
    <DocsLayout >
        <DocsHelmet pageTitle="Using products in Core" />
        <section>
            <UsingProductsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingProductsInCore
