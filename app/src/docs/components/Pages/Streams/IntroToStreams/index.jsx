// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToStreamsContent from '$docs/content/streams/introToStreams.mdx'

const IntroToStreams = () => (
    <DocsLayout>
        <DocsHelmet title="Intro to streams" />
        <section>
            <IntroToStreamsContent />
        </section>
    </DocsLayout>
)

export default IntroToStreams
