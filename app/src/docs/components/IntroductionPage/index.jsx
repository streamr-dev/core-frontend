// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import IntroductionPageContent from './Content.mdx'

const subNav = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const IntroductionPage = () => (
    <DocsLayout subNav={subNav}>
        <IntroductionPageContent />
    </DocsLayout>
)

export default IntroductionPage
