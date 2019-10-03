// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToStreamsContent from '$docs/content/streams/introToStreams.mdx'

const IntroToStreams = () => (
    <DocsLayout>
        <Helmet title="Intro to streams | Streamr Docs" />
        <section>
            <IntroToStreamsContent />
        </section>
    </DocsLayout>
)

export default IntroToStreams
