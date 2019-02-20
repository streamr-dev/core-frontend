// @flow

import React from 'react'

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
        <VisualEditorPageContent />
    </DocsLayout>
)

export default VisualEditorPage
