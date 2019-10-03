// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingCanvasesInCoreContent from '$docs/content/canvases/usingCanvasesInCore.mdx'

const UsingCanvasesInCore = () => (
    <DocsLayout >
        <Helmet title="Using canvases in Core | Streamr Docs" />
        <section>
            <UsingCanvasesInCoreContent />
        </section>
    </DocsLayout>
)

export default UsingCanvasesInCore
