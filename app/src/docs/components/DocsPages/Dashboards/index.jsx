// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToDashboards from '$docs/content/dashboards/introToDashboards.mdx'
import WorkWithDashboardsInCore from '$docs/content/dashboards/workWithDashboardsInCore.mdx'

const Dashboards = () => (
    <DocsLayout subNav={subNav.dashboards}>
        <Helmet title="Dashboards | Streamr Docs" />
        <section className="designUpdateWip"> {/* temporary section during design style pass */}
            <section id="intro-to-dashboards">
                <IntroToDashboards />
            </section>
            <section id="work-with-dashboards-in-core">
                <WorkWithDashboardsInCore />
            </section>
        </section>
    </DocsLayout>
)

export default Dashboards
