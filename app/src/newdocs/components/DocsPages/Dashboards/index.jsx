// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToDashboards from '$newdocs/content/dashboards/introToDashboards.mdx'
import WorkWithDashboardsInCore from '$newdocs/content/dashboards/workWithDashboardsInCore.mdx'

const Dashboards = () => (
    <DocsLayout subNav={subNav.dashboards}>
        <Helmet title="Dashboards | Streamr Docs" />
        <section id="intro-to-dashboards">
            <IntroToDashboards />
        </section>
        <section id="work-with-dashboards-in-core">
            <WorkWithDashboardsInCore />
        </section>
    </DocsLayout>
)

export default Dashboards
