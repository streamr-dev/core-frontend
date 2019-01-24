// @flow

import React from 'react'

import DocsLayout from '../DocsLayout'

// $FlowFixMe
import TutorialsPageContent from './Content.mdx'

const subNav = {}

const TutorialsPage = () => (
    <DocsLayout subNav={subNav}>
        <TutorialsPageContent />
    </DocsLayout>
)

export default TutorialsPage
