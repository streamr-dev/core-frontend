// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import TutorialsPageContent from './Content.mdx'

const subNavigationItems = {}

const TutorialsPage = () => (
    <DocsLayout subNavigationItems={subNavigationItems}>
        <TutorialsPageContent />
    </DocsLayout>
)

export default TutorialsPage
