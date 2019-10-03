// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntegrationPatternsContent from '$docs/content/streams/integrationPatterns.mdx'

const IntegrationPatterns = () => (
    <DocsLayout>
        <Helmet title="Integration patterns | Streamr Docs" />
        <section>
            <IntegrationPatternsContent />
        </section>
    </DocsLayout>
)

export default IntegrationPatterns
