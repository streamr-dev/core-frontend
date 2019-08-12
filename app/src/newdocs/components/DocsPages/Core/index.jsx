// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToCore from '$newdocs/content/core/introToCore.mdx'
import WorkWithStreamsInCore from '$newdocs/content/streams/workWithStreamsInCore.mdx'
import WorkWithCanvasesInCore from '$newdocs/content/canvases/workWithCanvasesInCore.mdx'
import WorkWithDashboardsInCore from '$newdocs/content/dashboards/workWithDashboardsInCore.mdx'
import WorkWithProductsInCore from '$newdocs/content/products/workWithProductsInCore.mdx'

const Core = () => (
    <DocsLayout subNav={subNav.core}>
        <Helmet title="Core | Streamr Docs" />
        <section id="intro-to-core">
            <IntroToCore />
        </section>
        <section id="work-with-streams-in-core">
            <WorkWithStreamsInCore />
        </section>
        <section id="work-with-canvases-in-core">
            <WorkWithCanvasesInCore />
        </section>
        <section id="work-with-dashboards-in-core">
            <WorkWithDashboardsInCore />
        </section>
        <section id="work-with-products-in-core">
            <WorkWithProductsInCore />
        </section>
    </DocsLayout>
)

export default Core
