// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingALightNodeContent from '$docs/content/streamrNodes/usingALightNode.mdx'

const UsingALightNode = () => (
    <DocsLayout>
        <DocsHelmet title="Using a light node" />
        <section>
            <UsingALightNodeContent />
        </section>
    </DocsLayout>
)

export default UsingALightNode
