// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingCanvasesContent from '$docs/content/canvases/usingCanvasesInCore.mdx'

const UsingCanvases = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Using canvases" />
        <section>
            <UsingCanvasesContent />
        </section>
    </DocsLayout>
)

export default UsingCanvases
