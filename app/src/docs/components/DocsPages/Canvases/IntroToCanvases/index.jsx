// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToCanvasesContent from '$docs/content/canvases/introToCanvases.mdx'

const IntroToCanvases = () => (
    <DocsLayout>
        <Helmet title="Intro to canvases | Streamr Docs" />
        <section>
            <IntroToCanvasesContent />
        </section>
    </DocsLayout>
)

export default IntroToCanvases
