// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import StorageContent from '$docs/content/streams/storage.mdx'

const Storage = () => (
    <DocsLayout>
        <DocsHelmet title="Storage" />
        <section>
            <StorageContent />
        </section>
    </DocsLayout>
)

export default Storage
