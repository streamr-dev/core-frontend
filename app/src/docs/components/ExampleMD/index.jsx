// @flow

// THIS PAGE IS NOT FOR PRODUCTION
import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import ExampleMDContent from '$docs/content/exampleMD.mdx'

const ExampleMD = () => (
    <DocsLayout>
        <Helmet>
            <title>Getting Started - Streamr Docs</title>
        </Helmet>
        <ExampleMDContent />
    </DocsLayout>
)

export default ExampleMD
