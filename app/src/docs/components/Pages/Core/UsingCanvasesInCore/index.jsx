// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingCanvasesInCoreContent from '$docs/content/canvases/usingCanvasesInCore.mdx'

const UsingCanvasesInCore = () => (
    <DocsLayout >
        <DocsHelmet pageTitle="Using canvases in Core" />
        <section>
            <UsingCanvasesInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingCanvasesInCore
