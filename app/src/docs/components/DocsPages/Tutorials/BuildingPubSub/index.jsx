// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import BuildingPubSubContent from '$docs/content/tutorials/buildingPubSub.mdx'

const BuildingPubSub = () => (
    <DocsLayout>
        <Helmet title="Building a simple Pub-Sub | Streamr Docs" />
        <section>
            <BuildingPubSubContent />
        </section>
    </DocsLayout>
)

export default BuildingPubSub
