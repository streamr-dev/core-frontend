// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import SdkOverviewContent from '$docs/content/sdk/overview.mdx'

const Sdk = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="SDKs" />
        <section>
            <section id="sdk-overview">
                <SdkOverviewContent />
            </section>
        </section>
    </DocsLayout>
)

export default Sdk
