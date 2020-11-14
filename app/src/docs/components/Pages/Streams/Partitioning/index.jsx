// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import PartitioningContent from '$docs/content/streams/partitioning.mdx'

const Partitioning = () => (
    <DocsLayout>
        <DocsHelmet title="Partitioning" />
        <section>
            <PartitioningContent />
        </section>
    </DocsLayout>
)

export default Partitioning
