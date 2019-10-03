// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataTokenContent from '$docs/content/dataToken/dataToken.mdx'

const DataToken = () => (
    <DocsLayout>
        <Helmet title="DATA Token | Streamr Docs" />
        <DataTokenContent />
    </DocsLayout>
)

export default DataToken
