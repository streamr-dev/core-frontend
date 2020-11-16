// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToCoreContent from '$docs/content/core/introToCore.mdx'

const IntroToCore = () => (
    <DocsLayout >
        <DocsHelmet title="Intro to core" />
        <section>
            <IntroToCoreContent />
        </section>
    </DocsLayout>
)

export default IntroToCore
