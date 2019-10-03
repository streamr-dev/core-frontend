// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsViaSdkContent from '$docs/content/streams/usingStreamsViaSdk.mdx'

const UsingStreamsViaSdk = () => (
    <DocsLayout>
        <Helmet title="Using streams via SDKs | Streamr Docs" />
        <section>
            <UsingStreamsViaSdkContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsViaSdk
