// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UXBestPractisesContent from '$docs/content/dataUnions/uxBestPractises.mdx'

const UXBestPractises = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Data Unions UX best practices" />
        <section>
            <UXBestPractisesContent />
        </section>
    </DocsLayout>
)

export default UXBestPractises
