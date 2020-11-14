// @flow

import React from 'react'
import { DocsHelmet } from '$shared/components/Helmet'
import DocsLayout from '$docs/components/DocsLayout'
import UXBestPracticesContent from '$docs/content/dataUnions/uxBestPractices.mdx'

const UXBestPractices = () => (
    <DocsLayout>
        <DocsHelmet title="Data Unions UX best practices" />
        <section>
            <UXBestPracticesContent />
        </section>
    </DocsLayout>
)

export default UXBestPractices
