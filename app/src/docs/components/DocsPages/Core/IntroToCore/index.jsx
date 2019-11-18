// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToCoreContent from '$docs/content/core/introToCore.mdx'

const IntroToCore = () => (
    <DocsLayout >
        <DocsHelmet pageTitle="Intro to core" />
        <section>
            <IntroToCoreContent />
        </section>
    </DocsLayout>
)

export default IntroToCore
