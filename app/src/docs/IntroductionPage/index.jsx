// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import IntroductionPageContent from './Content.mdx'

const subNavigationItems = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

const IntroductionPage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <IntroductionPageContent />
    </DocsLayout>
)

export default IntroductionPage
