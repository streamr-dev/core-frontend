// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataTokenContent from '$docs/content/dataToken/dataToken.mdx'

const DataToken = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="DATA Token" />
        <DataTokenContent />
    </DocsLayout>
)

export default DataToken
