// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToCoreContent from '$docs/content/core/introToCore.mdx'

const IntroToCore = () => (
    <DocsLayout >
        <Helmet title="Intro to core | Streamr Docs" />
        <section>
            <IntroToCoreContent />
        </section>
    </DocsLayout>
)

export default IntroToCore
