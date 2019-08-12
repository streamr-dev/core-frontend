// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import BuildingPubSub from '$newdocs/content/tutorials/buildingPubSub.mdx'
import BuildingCustomModule from '$newdocs/content/tutorials/buildingCustomModule.mdx'

const Tutorials = () => (
    <DocsLayout subNav={subNav.tutorials}>
        <Helmet title="Tutorials | Streamr Docs" />
        <section id="building-a-simple-pub-sub-system">
            <BuildingPubSub />
        </section>
        <section id="building-custom-canvas-module">
            <BuildingCustomModule />
        </section>
    </DocsLayout>
)

export default Tutorials
