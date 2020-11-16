// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ApiOverviewContent from '$docs/content/api/overview.mdx'

const ApiOverview = () => (
    <DocsLayout>
        <DocsHelmet title="API Overview" />
        <section>
            <ApiOverviewContent />
        </section>
    </DocsLayout>
)

export default ApiOverview
