// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import SharingResourcesInCore from '$docs/content/core/sharingResourcesInCore.mdx'

const SharingResources = () => (
    <DocsLayout >
        <DocsHelmet title="Sharing resources in Core" />
        <section>
            <SharingResourcesInCore />
        </section>
    </DocsLayout>
)

export default SharingResources
