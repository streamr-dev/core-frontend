// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataTokenContent from '$docs/content/dataToken/dataToken.mdx'

const DataToken = () => (
    <DocsLayout>
        <DocsHelmet title="DATA Token" />
        <DataTokenContent />
    </DocsLayout>
)

export default DataToken
