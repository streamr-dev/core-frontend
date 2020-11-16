// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import BuildingPubSubContent from '$docs/content/tutorials/buildingPubSub.mdx'

const BuildingPubSub = () => (
    <DocsLayout>
        <DocsHelmet title="Building a simple Pub-Sub" />
        <section>
            <BuildingPubSubContent />
        </section>
    </DocsLayout>
)

export default BuildingPubSub
