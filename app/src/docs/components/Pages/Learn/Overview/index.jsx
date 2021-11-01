// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import OverviewContent from '$docs/content/learn/overview.mdx'

const Overview = () => (
    <DocsLayout>
        <DocsHelmet title="Overview" />
        <section>
            <OverviewContent />
        </section>
    </DocsLayout>
)

export default Overview
