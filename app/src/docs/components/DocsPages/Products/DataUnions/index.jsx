// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsPlaceholderContent from '$docs/content/products/dataUnionsPlaceholder.mdx'
import DataUnionsContent from '$docs/content/products/dataUnions.mdx'

const DataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Data Unions" />
        <section>
            {!process.env.DATA_UNIONS && (<DataUnionsPlaceholderContent />)}
            {!!process.env.DATA_UNIONS && (<DataUnionsContent />)}
        </section>
    </DocsLayout>
)

export default DataUnions
