// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import VisualEditorPageContent from './Content.mdx'

const subNavigationItems = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const VisualEditorPage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <VisualEditorPageContent />
    </DocsLayout>
)

export default VisualEditorPage
