// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import SdksOverviewContent from '$docs/content/sdks/sdksOverview.mdx'

const SDKs = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="SDKs" />
        <section>
            <section id="sdks-overview">
                <SdksOverviewContent />
            </section>
        </section>
    </DocsLayout>
)

export default SDKs
