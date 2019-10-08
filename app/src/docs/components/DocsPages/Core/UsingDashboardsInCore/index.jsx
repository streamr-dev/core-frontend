// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingDashboardsInCoreContent from '$docs/content/core/usingDashboardsInCore.mdx'

const UsingDashboardsInCore = () => (
    <DocsLayout >
        <Helmet title="Using dashboards in Core | Streamr Docs" />
        <section>
            <UsingDashboardsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingDashboardsInCore
