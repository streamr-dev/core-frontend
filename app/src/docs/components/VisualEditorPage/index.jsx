// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import VisualEditorPageContent from './Content.mdx'

const subNav = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const VisualEditorPage = () => (
    <DocsLayout subNav={subNav}>
        <VisualEditorPageContent />
    </DocsLayout>
)

export default VisualEditorPage
