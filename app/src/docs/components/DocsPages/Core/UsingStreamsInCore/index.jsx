// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingStreamsInCoreContent from '$docs/content/streams/usingStreamsInCore.mdx'

const UsingStreamsInCore = () => (
    <DocsLayout >
        <DocsHelmet pageTitle="Using streams in Core" />
        <section>
            <UsingStreamsInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingStreamsInCore
