// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToDashboards from '$docs/content/dashboards/introToDashboards.mdx'
import UsingDashboardsInCore from '$docs/content/dashboards/usingDashboardsInCore.mdx'

const Dashboards = () => (
    <DocsLayout>
        <Helmet title="Dashboards | Streamr Docs" />
        <section className="designUpdateWip"> {/* temporary section during design style pass */}
            <section id="intro-to-dashboards">
                <IntroToDashboards />
            </section>
            <section id="using-dashboards-in-core">
                <UsingDashboardsInCore />
            </section>
        </section>
    </DocsLayout>
)

export default Dashboards
