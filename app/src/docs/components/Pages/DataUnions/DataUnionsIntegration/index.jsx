// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsContent from '$docs/content/dataUnions/integration.mdx'

const DataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Integrate Data Unions into your app" />
        <section>
            <DataUnionsContent />
        </section>
    </DocsLayout>
)

export default DataUnions
