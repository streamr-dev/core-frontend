// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToCanvasesContent from '$docs/content/canvases/introToCanvases.mdx'

const IntroToCanvases = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to canvases" />
        <section>
            <IntroToCanvasesContent />
        </section>
    </DocsLayout>
)

export default IntroToCanvases
