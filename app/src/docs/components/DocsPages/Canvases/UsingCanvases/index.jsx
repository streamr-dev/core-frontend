// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UsingCanvasesContent from '$docs/content/canvases/usingCanvasesInCore.mdx'

const UsingCanvases = () => (
    <DocsLayout>
        <Helmet title="Using canvases | Streamr Docs" />
        <section>
            <UsingCanvasesContent />
        </section>
    </DocsLayout>
)

export default UsingCanvases
