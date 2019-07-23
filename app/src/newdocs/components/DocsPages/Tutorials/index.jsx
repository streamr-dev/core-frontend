// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import TutorialsContent from '$newdocs/content/tutorials.mdx'

const Tutorials = () => (
    <DocsLayout subNav={subNav.tutorials}>
        <Helmet title="Tutorials | Streamr Docs" />
        <TutorialsContent />
    </DocsLayout>
)

export default Tutorials
