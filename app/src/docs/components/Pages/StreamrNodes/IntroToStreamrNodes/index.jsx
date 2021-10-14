// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToStreamrNodesContent from '$docs/content/streamrNodes/introToStreamrNodes.mdx'

const IntroToStreamrNodes = () => (
    <DocsLayout>
        <DocsHelmet title="Intro to Streamr nodes" />
        <section>
            <IntroToStreamrNodesContent />
        </section>
    </DocsLayout>
)

export default IntroToStreamrNodes
