// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import VisualEditorPageContent from './Content.mdx'

const subNav = {
    introduction: 'Introduction',
    streams: 'Streams',
    modules: 'Modules',
    canvases: 'Canvases',
    extensions: 'Extensions',
}

const VisualEditorPage = () => (
    <DocsLayout subNav={subNav}>
        <Helmet>
            <title>Visual Editor- Streamr Docs</title>
        </Helmet>
        <VisualEditorPageContent />
    </DocsLayout>
)

export default VisualEditorPage
