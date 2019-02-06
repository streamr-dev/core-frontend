// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'
import StreamrEnginePageContent from './Content.mdx'

const subNav = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const StreamrEnginePage = () => (
    <DocsLayout subNav={subNav}>
        <StreamrEnginePageContent />
    </DocsLayout>
)

export default StreamrEnginePage
