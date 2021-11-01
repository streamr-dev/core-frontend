// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import CreatingADataUnionContent from '$docs/content/dataUnions/creatingADataUnion.mdx'

const CreatingADataUnion = () => (
    <DocsLayout>
        <DocsHelmet title="Creating a Data Union" />
        <section>
            <CreatingADataUnionContent />
        </section>
    </DocsLayout>
)

export default CreatingADataUnion
