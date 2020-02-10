// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsContent from '$docs/content/products/dataUnions.mdx'

const DataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Data Unions" />
        <section>
            <DataUnionsContent />
        </section>
    </DocsLayout>
)

export default DataUnions
