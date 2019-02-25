// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import ApiContent from '$docs/content/api.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const ApiPage = () => (
    <DocsLayout subNav={subNav.api}>
        <Helmet>
            <title>Streamr API - Streamr Docs</title>
        </Helmet>
        <ApiContent />
    </DocsLayout>
)

export default ApiPage
