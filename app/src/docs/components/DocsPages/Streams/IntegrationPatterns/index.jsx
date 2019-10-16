// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntegrationPatternsContent from '$docs/content/streams/integrationPatterns.mdx'

const IntegrationPatterns = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Integration patterns" />
        <section>
            <IntegrationPatternsContent />
        </section>
    </DocsLayout>
)

export default IntegrationPatterns
