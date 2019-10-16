// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import ApiOverviewContent from '$docs/content/api/apiOverview.mdx'

const ApiOverview = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="API Overview" />
        <section>
            <ApiOverviewContent />
        </section>
    </DocsLayout>
)

export default ApiOverview
