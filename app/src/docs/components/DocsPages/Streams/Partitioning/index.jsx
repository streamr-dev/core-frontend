// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import PartitioningContent from '$docs/content/streams/partitioning.mdx'

const Partitioning = () => (
    <DocsLayout>
        <Helmet title="Partitioning | Streamr Docs" />
        <section>
            <PartitioningContent />
        </section>
    </DocsLayout>
)

export default Partitioning
