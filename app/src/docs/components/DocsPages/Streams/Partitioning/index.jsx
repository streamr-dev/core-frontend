// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import PartitioningContent from '$docs/content/streams/partitioning.mdx'

const Partitioning = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Partitioning" />
        <section>
            <PartitioningContent />
        </section>
    </DocsLayout>
)

export default Partitioning
