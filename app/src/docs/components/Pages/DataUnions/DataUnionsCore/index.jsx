// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsCoreContent from '$docs/content/dataUnions/dataUnionsCore.mdx'

const DataUnionsInCore = () => (
    <DocsLayout>
        <DocsHelmet title="Create a Data Union with Core" />
        <section>
            <DataUnionsCoreContent />
        </section>
    </DocsLayout>
)

export default DataUnionsInCore
