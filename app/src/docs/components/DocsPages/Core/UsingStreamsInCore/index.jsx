// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsInCoreContent from '$docs/content/streams/usingStreamsInCore.mdx'

const UsingStreamsInCore = () => (
    <DocsLayout >
        <Helmet title="Using streams in Core | Streamr Docs" />
        <section>
            <UsingStreamsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsInCore
