// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../DocsLayout'
import ApiContent from '$docs/content/api.mdx'
import { subNav } from '../DocsLayout/Navigation/navLinks'

const ApiPage = () => (
    <DocsLayout subNav={subNav.api}>
        <Helmet title="Streamr Docs | Streamr API" />
        <ApiContent />
    </DocsLayout>
)

export default ApiPage
