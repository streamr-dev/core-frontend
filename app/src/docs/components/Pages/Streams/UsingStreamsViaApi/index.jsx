// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsViaApiContent from '$docs/content/streams/usingStreamsViaApi.mdx'

const UsingStreamsViaApi = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Work with streams via API" />
        <section>
            <UsingStreamsViaApiContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsViaApi
