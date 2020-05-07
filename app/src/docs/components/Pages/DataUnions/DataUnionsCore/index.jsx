// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsCoreContent from '$docs/content/dataUnions/dataUnionsCore.mdx'

const DataUnionsInCore = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Create a Data Union with Core" />
        <section>
            <DataUnionsCoreContent />
        </section>
    </DocsLayout>
)

export default DataUnionsInCore
