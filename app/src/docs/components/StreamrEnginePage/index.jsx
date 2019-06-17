// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import StreamrEngineContent from '$docs/content/streamrEngine.mdx'

const StreamrEnginePage = () => (
    <DocsLayout>
        <Helmet>
            <title>Streamr Docs | Streamr Engine</title>
        </Helmet>
        <StreamrEngineContent />
    </DocsLayout>
)

export default StreamrEnginePage
