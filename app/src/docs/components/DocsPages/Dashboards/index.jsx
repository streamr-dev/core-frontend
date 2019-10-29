// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToDashboards from '$docs/content/dashboards/introToDashboards.mdx'

const Dashboards = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Dashboards" />
        <section>
            <section>
                <IntroToDashboards />
            </section>
        </section>
    </DocsLayout>
)

export default Dashboards
