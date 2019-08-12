// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'

import DataTokenContent from '$newdocs/content/dataToken/dataToken.mdx'

const DataToken = () => (
    <DocsLayout subNav={subNav.dataToken}>
        <Helmet title="DATA Token | Streamr Docs" />
        <DataTokenContent />
    </DocsLayout>
)

export default DataToken
