// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import DataTokenContent from '$newdocs/content/dataToken.mdx'

const DataToken = () => (
    <DocsLayout subNav={subNav.dataToken}>
        <Helmet title="Streamr Docs | DATA Token" />
        <DataTokenContent />
    </DocsLayout>
)

export default DataToken
