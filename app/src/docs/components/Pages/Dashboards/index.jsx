// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToDashboards from '$docs/content/dashboards/introToDashboards.mdx'

const Dashboards = () => (
    <DocsLayout>
        <DocsHelmet title="Dashboards" />
        <section>
            <section>
                <IntroToDashboards />
            </section>
        </section>
    </DocsLayout>
)

export default Dashboards
