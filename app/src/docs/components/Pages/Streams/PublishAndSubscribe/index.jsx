// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import PublishAndSubscribeContent from '$docs/content/streams/publishAndSubscribe.mdx'

const PublishAndSubscribe = () => (
    <DocsLayout>
        <DocsHelmet title="Managing your streams" />
        <section>
            <PublishAndSubscribeContent />
        </section>
    </DocsLayout>
)

export default PublishAndSubscribe
