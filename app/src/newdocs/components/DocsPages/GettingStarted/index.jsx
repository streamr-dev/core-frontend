// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import GettingStartedContent from '$newdocs/content/gettingStarted.mdx'

const GettingStarted = () => (
    <DocsLayout subNav={subNav.gettingStarted}>
        <Helmet title="Getting Started | Streamr Docs" />
        <GettingStartedContent />
    </DocsLayout>
)

export default GettingStarted
