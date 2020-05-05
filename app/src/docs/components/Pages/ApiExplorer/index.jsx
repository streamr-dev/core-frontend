// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import ApiExplorerContent from '$docs/content/apiExplorer/apiExplorer.mdx'

const ApiExplorer = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="API Explorer" />
        <section>
            <ApiExplorerContent />
        </section>
    </DocsLayout>
)

export default ApiExplorer
