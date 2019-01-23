// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import StreamrEnginePageContent from './Content.mdx'

const subNavigationItems = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const StreamrEnginePage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <StreamrEnginePageContent />
    </DocsLayout>
)

export default StreamrEnginePage
