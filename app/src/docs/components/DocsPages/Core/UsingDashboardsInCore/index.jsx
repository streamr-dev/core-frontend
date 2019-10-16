// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingDashboardsInCoreContent from '$docs/content/core/usingDashboardsInCore.mdx'

const UsingDashboardsInCore = () => (
    <DocsLayout >
        <DocsHelmet pageTitle="Using dashboards in Core" />
        <section>
            <UsingDashboardsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingDashboardsInCore
