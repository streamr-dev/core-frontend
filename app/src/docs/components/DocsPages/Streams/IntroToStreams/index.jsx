// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToStreamsContent from '$docs/content/streams/introToStreams.mdx'

const IntroToStreams = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to streams" />
        <section>
            <IntroToStreamsContent />
        </section>
    </DocsLayout>
)

export default IntroToStreams
