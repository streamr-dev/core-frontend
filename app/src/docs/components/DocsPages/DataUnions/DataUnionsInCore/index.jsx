// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsInCoreContent from '$docs/content/dataUnions/dataUnionsInCore.mdx'

const DataUnionsInCore = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Create a Data Union with Core" />
        <section>
            <DataUnionsInCoreContent />
        </section>
    </DocsLayout>
)

export default DataUnionsInCore
