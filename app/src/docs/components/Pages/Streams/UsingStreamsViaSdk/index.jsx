// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsViaSdkContent from '$docs/content/streams/usingStreamsViaSdk.mdx'

const UsingStreamsViaSdk = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Using streams via SDKs" />
        <section>
            <UsingStreamsViaSdkContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsViaSdk
