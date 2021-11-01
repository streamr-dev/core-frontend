// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import GlossaryContent from '$docs/content/learn/glossary.mdx'

const Glossary = () => (
    <DocsLayout>
        <DocsHelmet title="Glossary" />
        <section>
            <GlossaryContent />
        </section>
    </DocsLayout>
)

export default Glossary
