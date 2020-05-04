// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import DataUnionsContent from '$docs/content/dataUnions/introToDataUnions.mdx'

const DataUnions = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Intro to Data Unions" />
        <section>
            <DataUnionsContent />
        </section>
    </DocsLayout>
)

export default DataUnions
