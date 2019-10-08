// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToDashboards from '$docs/content/dashboards/introToDashboards.mdx'

const Dashboards = () => (
    <DocsLayout>
        <Helmet title="Dashboards | Streamr Docs" />
        <section>
            <section>
                <IntroToDashboards />
            </section>
        </section>
    </DocsLayout>
)

export default Dashboards
