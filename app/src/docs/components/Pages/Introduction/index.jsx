// @flow

import React from 'react'
import DocsLayout from '$docs/components/DocsLayout'
import { DocsHelmet } from '$shared/components/Helmet'
import IntroductionContent from '$docs/content/introduction/introduction.mdx'

const Introduction = () => (
    <DocsLayout>
        <DocsHelmet title="Introduction" />
        <section>
            <IntroductionContent />
        </section>
    </DocsLayout>
)

export default Introduction
