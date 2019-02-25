// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import TutorialsContent from '$docs/content/tutorials.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const TutorialsPage = () => (
    <DocsLayout subNav={subNav.tutorials}>
        <Helmet>
            <title>Tutorials - Streamr Docs</title>
        </Helmet>
        <TutorialsContent />
    </DocsLayout>
)

export default TutorialsPage
