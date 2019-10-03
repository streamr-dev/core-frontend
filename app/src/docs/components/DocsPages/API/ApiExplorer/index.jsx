// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ApiExplorerContent from '$docs/content/api/apiExplorer.mdx'

const ApiExplorer = () => (
    <DocsLayout>
        <Helmet title="API Explorer | Streamr Docs" />
        <section>
            <ApiExplorerContent />
        </section>
    </DocsLayout>
)

export default ApiExplorer
