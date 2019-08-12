// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import IntroToCanvases from '$docs/content/canvases/introToCanvases.mdx'
import WorkWithCanvasesInCore from '$docs/content/canvases/workWithCanvasesInCore.mdx'
import BuildingIntegrations from '$docs/content/canvases/buildingIntegrations.mdx'
import EthereumModules from '$docs/content/canvases/ethereumModules.mdx'

const Canvases = () => (
    <DocsLayout subNav={subNav.canvases}>
        <Helmet title="Canvases | Streamr Docs" />
        <section id="intro-to-canvases">
            <IntroToCanvases />
        </section>
        <section id="work-with-canvases-in-core">
            <WorkWithCanvasesInCore />
        </section>
        <section id="building-integrations">
            <BuildingIntegrations />
        </section>
        <section id="ethereum-modules">
            <EthereumModules />
        </section>
    </DocsLayout>
)

export default Canvases
