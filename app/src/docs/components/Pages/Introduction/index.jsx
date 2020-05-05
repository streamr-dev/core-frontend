// @flow

import React from 'react'
import DocsLayout from '$docs/components/DocsLayout'
import DocsHelmet from '$docs/components/DocsHelmet'
import IntroductionContent from '$docs/content/introduction/introduction.mdx'

const Introduction = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Introduction" />
        <section>
            <IntroductionContent />
        </section>
    </DocsLayout>
)

export default Introduction
