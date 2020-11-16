// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ApiExplorerContent from '$docs/content/apiExplorer/apiExplorer.mdx'

const ApiExplorer = () => (
    <DocsLayout>
        <DocsHelmet title="API Explorer" />
        <section>
            <ApiExplorerContent />
        </section>
    </DocsLayout>
)

export default ApiExplorer
