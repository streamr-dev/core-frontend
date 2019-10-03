// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ApiOverviewContent from '$docs/content/api/apiOverview.mdx'

const ApiOverview = () => (
    <DocsLayout>
        <Helmet title="API Overview | Streamr Docs" />
        <section>
            <ApiOverviewContent />
        </section>
    </DocsLayout>
)

export default ApiOverview
