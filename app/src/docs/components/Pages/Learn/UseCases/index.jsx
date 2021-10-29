// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UseCasesContent from '$docs/content/learn/useCases.mdx'

const UseCases = () => (
    <DocsLayout>
        <DocsHelmet title="Use Cases" />
        <section>
            <UseCasesContent />
        </section>
    </DocsLayout>
)

export default UseCases
