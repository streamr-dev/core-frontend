// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import MiningContent from '$docs/content/streamrNodes/mining.mdx'

const Mining = () => (
    <DocsLayout>
        <DocsHelmet title="Mining" />
        <section>
            <MiningContent />
        </section>
    </DocsLayout>
)

export default Mining
