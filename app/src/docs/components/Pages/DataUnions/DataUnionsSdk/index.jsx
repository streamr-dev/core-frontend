// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsContent from '$docs/content/dataUnions/dataUnionsSdk.mdx'

const DataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Build a Data Union with the Streamr SDK" />
        <section>
            <DataUnionsContent />
        </section>
    </DocsLayout>
)

export default DataUnions
