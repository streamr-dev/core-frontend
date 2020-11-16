// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import IntroToCanvasesContent from '$docs/content/canvases/introToCanvases.mdx'

const IntroToCanvases = () => (
    <DocsLayout>
        <DocsHelmet title="Intro to canvases" />
        <section>
            <IntroToCanvasesContent />
        </section>
    </DocsLayout>
)

export default IntroToCanvases
