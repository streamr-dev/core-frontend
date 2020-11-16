// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsInCoreContent from '$docs/content/streams/usingStreamsInCore.mdx'

const UsingStreamsInCore = () => (
    <DocsLayout>
        <DocsHelmet title="Using streams in Core" />
        <section>
            <UsingStreamsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsInCore
