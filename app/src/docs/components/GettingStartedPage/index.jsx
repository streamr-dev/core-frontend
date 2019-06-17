// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import GettingStartedContent from '$docs/content/gettingStarted.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const GettingStartedPage = () => (
    <DocsLayout subNav={subNav.gettingStarted}>
        <Helmet>
            <title>Streamr Docs | Getting Started</title>
        </Helmet>
        <GettingStartedContent />
    </DocsLayout>
)

export default GettingStartedPage
