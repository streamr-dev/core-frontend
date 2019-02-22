// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import StreamrEnginePageContent from './Content.mdx'

const StreamrEnginePage = () => (
    <DocsLayout>
        <Helmet>
            <title>Streamr Engine - Streamr Docs</title>
        </Helmet>
        <StreamrEnginePageContent />
    </DocsLayout>
)

export default StreamrEnginePage
