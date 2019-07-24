// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import SDKsContent from '$newdocs/content/SDKs.mdx'

const SDKs = () => (
    <DocsLayout subNav={subNav.SDKs}>
        <Helmet title="SDKs | Streamr Docs" />
        <SDKsContent />
    </DocsLayout>
)

export default SDKs
