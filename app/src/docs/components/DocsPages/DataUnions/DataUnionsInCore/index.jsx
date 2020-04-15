// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsContent from '$docs/content/dataUnions/dataUnionsInCore.mdx'

const DataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Build a Data Union with Core" />
        <section>
            <DataUnionsContent />
        </section>
    </DocsLayout>
)

export default DataUnions
