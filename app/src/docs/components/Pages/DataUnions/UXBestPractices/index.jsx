// @flow

import React from 'react'
import DocsHelmet from '$docs/components/DocsHelmet'
import DocsLayout from '$docs/components/DocsLayout'
import UXBestPracticesContent from '$docs/content/dataUnions/uxBestPractices.mdx'

const UXBestPractices = () => (
    <DocsLayout>
        <DocsHelmet pageTitle="Data Unions UX best practices" />
        <section>
            <UXBestPracticesContent />
        </section>
    </DocsLayout>
)

export default UXBestPractises
