// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import DashboardsContent from '$newdocs/content/dashboards.mdx'

const Dashboards = () => (
    <DocsLayout subNav={subNav.dashboards}>
        <Helmet title="Streamr Docs | Dashboards" />
        <DashboardsContent />
    </DocsLayout>
)

export default Dashboards
