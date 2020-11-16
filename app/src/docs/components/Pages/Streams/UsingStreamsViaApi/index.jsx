// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsViaApiContent from '$docs/content/streams/usingStreamsViaApi.mdx'

const UsingStreamsViaApi = () => (
    <DocsLayout>
        <DocsHelmet title="Work with streams via API" />
        <section>
            <UsingStreamsViaApiContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsViaApi
