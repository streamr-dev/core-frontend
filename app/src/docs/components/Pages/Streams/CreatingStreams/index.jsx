// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import CreatingStreamsContent from '$docs/content/streams/creatingStreams.mdx'

const CreatingStreams = () => (
    <DocsLayout>
        <DocsHelmet title="Creating streams" />
        <section>
            <CreatingStreamsContent />
        </section>
    </DocsLayout>
)

export default CreatingStreams
