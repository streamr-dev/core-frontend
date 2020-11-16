// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntegrationPatternsContent from '$docs/content/streams/integrationPatterns.mdx'

const IntegrationPatterns = () => (
    <DocsLayout>
        <DocsHelmet title="Integration patterns" />
        <section>
            <IntegrationPatternsContent />
        </section>
    </DocsLayout>
)

export default IntegrationPatterns
