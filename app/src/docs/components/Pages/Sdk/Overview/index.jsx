// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import SdkOverviewContent from '$docs/content/sdk/overview.mdx'

const Sdk = () => (
    <DocsLayout>
        <DocsHelmet title="SDKs" />
        <section>
            <section id="sdk-overview">
                <SdkOverviewContent />
            </section>
        </section>
    </DocsLayout>
)

export default Sdk
