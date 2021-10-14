// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import ManagingYourStreamsContent from '$docs/content/streams/managingYourStreams.mdx'

const ManagingYourStreams = () => (
    <DocsLayout>
        <DocsHelmet title="Managing your streams" />
        <section>
            <ManagingYourStreamsContent />
        </section>
    </DocsLayout>
)

export default ManagingYourStreams
